import graphene
from django.contrib.auth.models import Group
from django.db import transaction
from apps.accounts.models import User as CustomUser, UserOTP, UserRole, Address
from .objectType import UserType
from graphql import GraphQLError
from apps.base.utils import create_graphql_error, generate_otp, get_object_or_none
from graphene_django.forms.mutation import DjangoFormMutation
from backend.authentication import TokenManager, isAuthenticated
from .forms import UserForm, AddressForm
from django.conf import settings
base_url = settings.WEBSITE_URL


class RegisterUser(graphene.Mutation):
    """
        This mutation will be for end customer
    """
    class Arguments:
        name = graphene.String(required=True)
        email = graphene.String(required=True)
        whatsApp = graphene.String(required=True)
        password = graphene.String(required=True)

        phone = graphene.String(required=False)

    success = graphene.Boolean()
    message = graphene.String()
    id = graphene.ID()

    @transaction.atomic
    def mutate(self, info, name, email,password,whatsApp, phone=None):
        email = email.lower()
        find_user = get_object_or_none(CustomUser, email=email)
        if find_user is not None:
            raise GraphQLError(message="Email is already registered.")
        
        user = CustomUser.objects.create_user(
            name=name, email=email, password=password,whatsApp=whatsApp, phone=phone
        )
        role = Group.objects.get(name="CUSTOMER")
        user.is_verified = False  
        user.role  = role
        user.save()
        gen_otp = generate_otp()
        user.send_email_verification(
            gen_otp, base_url
        )
        new_otp=UserOTP(user=user, otp=gen_otp)
        new_otp.save()
        return RegisterUser(success=True, message="Registration successful!", id=user.id)

class OTPVerification(graphene.Mutation):
    success = graphene.Boolean()
    message = graphene.String()
    user = graphene.Field(UserType)
    
    class Arguments:
        email = graphene.String()
        otp = graphene.String()
    
    def mutate(self, info, email, otp, **kwargs):
        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise GraphQLError(
                message="Not Found User",
            )
        
        if user.is_verified:
            raise GraphQLError(message="You are already verified.")
        
        user_otp = UserOTP.objects.check_otp(otp=otp, user=user)
        
        if user_otp and user.is_active:
            user.is_verified = True
            user.save()
        else:
            raise GraphQLError(message="OTP is invalid or expired")
            
        return OTPVerification(
            success=True,
            message='User account is successfully verified',
            user = user
        )
class LoginUser(graphene.Mutation):
    class Arguments:
        email = graphene.String(required=True)
        password = graphene.String(required=True)

    token = graphene.String()
    success = graphene.Boolean()
    message = graphene.String()
    user = graphene.Field(UserType)
    @staticmethod
    def mutate(root, info, email, password):
        try:
            
            if not email:
                return LoginUser(token=None, success=False, message="Invalid email or password.",)
            user = CustomUser.objects.get(email=email.lower()) 

            if not user.check_password(password):
                return LoginUser(token=None, success=False, message="Invalid email or password.")
            if not user.is_active:
                return LoginUser(token=None, success=False, message="Account is inactive.")
            
            payload = {
                'name' : user.name,
                'email': user.email,
                'role': user.role.name if user.role else UserRole.ADMIN if user.is_superuser else UserRole.CUSTOMER,
                'photo': user.photo
            }
            token = TokenManager.get_access(payload)
            return LoginUser(token=token,user=user, success=True, message="Login successful.")
        except CustomUser.DoesNotExist:
            return LoginUser(token=None, success=False, message="Invalid email or password.",)
       
class PasswordResetMail(graphene.Mutation):
    message = graphene.String()
    success  = graphene.Boolean()
    
    class Arguments:
        email = graphene.String(required=True)
    
    def mutate(self, info, email):
        user = CustomUser.objects.get(email=email)
        otp = UserOTP.objects.get_object_or_none(user = user.id)
        if not otp:
            generated_top = generate_otp()
            otp = UserOTP(user=user, otp=generated_top)
            otp.save()
        
        verification_link = f"{base_url}/reset-password?otp={otp.otp}&email={user.email}"
        user.send_reset_password_mail(otp.otp, verification_link)
        return PasswordResetMail(
            message='Successfully send mail',
            success=True
        )

class PasswordReset(graphene.Mutation):
    message = graphene.String()
    success = graphene.Boolean()
    
    class Arguments:
        email = graphene.String(required=True)
        otp = graphene.String(required=True)
        password = graphene.String(required=True)
    
    def mutate(self, info, email, otp, password):
        
        user =  CustomUser.objects.get(email=email)
        if not UserOTP.objects.check_otp(otp=otp, user=user.id) :
            return GraphQLError(message="OTP is invalid!")

        user.set_password(password)
        user.save()
        
        return PasswordReset(message="Password reset success", success=True)
    
class PasswordChange(graphene.Mutation):
    message = graphene.String()
    success = graphene.Boolean()
    
    class Arguments:
        password = graphene.String()
        new_password = graphene.String()
    
    @isAuthenticated()
    def mutate(self, info, password, new_password):
        user = info.context.user
        if not user.check_password(password):
            raise GraphQLError(
                message="Wrong password",
                extensions={
                    "message": "Wrong password",
                    "code": "wrong_password"
                }
            )
        user.set_password(new_password)
        user.save()
        return PasswordChange(
            success=True,
            message="Password change successful"
        )

class ProfileUpdate(DjangoFormMutation):
    message = graphene.String()
    success = graphene.Boolean()
    profile = graphene.Field(UserType)
    
    class Meta:
        form_class = UserForm
    
    @isAuthenticated()
    def mutate_and_get_payload(self, info, **input):
        try:
            user = info.context.User

            instance = get_object_or_none(CustomUser, id=input.get('id') if input.get('id') else user.id)
            if not instance:
                raise GraphQLError("User not found!")
            
            role = user.role
            if role:
                input['role'] = role.id

            form = UserForm(input, instance=instance)
            
            
            
            # if phone is exit then error
            if input.get('phone'):
                user_by_number = get_object_or_none(CustomUser, phone=input.get('phone'))
                if user_by_number:
                    if user_by_number.id != user.id and user_by_number.phone == input.get('phone'):
                        raise GraphQLError("Phone number already exit.")
            
            print(form.errors)
            if not form.is_valid():
                raise create_graphql_error(form) 
            
            profile = form.save()
            return ProfileUpdate(message="Update profile!", success=True, profile=profile)
        except Exception as e:
            raise GraphQLError(e)
                
class AddressCUD(DjangoFormMutation):
    success = graphene.Boolean()
    id = graphene.ID()
    class Meta:
        form_class = AddressForm

    def mutate_and_get_payload(self, info, **input):
    
        instance = get_object_or_none(Address, id=input.get('id'))
        if not instance:
           instance = get_object_or_none(Address, user=input.get('user')) 
           
        form = AddressForm(input, instance=instance)
        if form.is_valid():
            address = form.save()
            return AddressCUD( success=True, id=address.id)

class Mutation(graphene.ObjectType):
    
    register_user = RegisterUser.Field()
    login_user = LoginUser.Field()
    otp_verify = OTPVerification.Field()
    password_reset_mail = PasswordResetMail.Field()
    password_reset = PasswordReset.Field()
    password_change = PasswordChange.Field()
    profile_update = ProfileUpdate.Field()
    address_cud = AddressCUD.Field()
    
 
