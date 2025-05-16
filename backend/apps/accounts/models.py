# models.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group
from django.db import models
from apps.base.models import BaseModelWithoutID
from django.conf import settings
from django.utils import timezone
from apps.accounts.tasks import send_email_on_delay
from decouple import config
base_url = settings.WEBSITE_URL
from apps.base.mail import send_mail_from_template

class GenderChoices(models.TextChoices):
    MALE = 'MALE', 'Male'
    FEMALE = 'FEMALE', 'Female'
    OTHER = 'OTHER', 'Other'

class UserRole(models.TextChoices):
    ADMIN = 'ADMIN', 'Admin'
    MANAGER = 'MANAGER', 'Manager'
    CUSTOMER = 'CUSTOMER', 'Customer'

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field is required")
        email = self.normalize_email(email)
        extra_fields.setdefault('is_active', True)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
        
    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class UserOTPManager(BaseUserManager):
    """
        check user OTP if Exist
    """
    def check_otp(self, otp, user):
        if not otp:
            return False
        try:
            row = self.get(otp=otp, user=user)
            if row.updated_at + timezone.timedelta(minutes=settings.OTP_TIMESTAMP) < timezone.now():
                row.delete()
                return False
            row.delete()    
            return True
        except self.model.DoesNotExist:
            return False
        
    def get_object_or_none(self, **kwargs):
        try:
            return self.get(**kwargs)
        except :
            return None
class User(
    BaseModelWithoutID, 
    AbstractBaseUser, 
    PermissionsMixin
    ):
    name = models.CharField(max_length=150, null=True, blank=True)
    email = models.EmailField(unique=True)
    gender = models.CharField(max_length=8, choices=GenderChoices.choices, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    photo = models.URLField(max_length=1000, blank=True, null=True)
    role = models.ForeignKey(Group, related_name='users', on_delete=models.SET_NULL, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True, unique=True)
    country = models.CharField(max_length=15, blank=True, null=True)
    whatsApp = models.CharField(max_length=15, blank=True, null=True )
    
    address = models.TextField( blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    term_and_condition_accepted = models.BooleanField(default=False)
    privacy_policy_accepted = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = UserManager()
    
    def send_email_verification(self, otp, base_url):
        self.is_verified = False
        self.save()
        context = {
            'company_name':'Bsoft',
            'logo_url': config("LOGO_URL", None),
            'first_name':self.name,
            'email':self.email,
            'verification_link':f'{base_url}/otp-verification/?otp={otp}&email={self.email}',
            'resend_link':f'{base_url}',
            'support_email':'support@b-soft.xyz',
            'website_url':f'{base_url}'
        }
        template = 'activation_mail.html'
        subject = 'Email Verification'
        send_email_on_delay(template, context, subject, self.email)
        
    def send_reset_password_mail(self, otp, verification_link):
        self.is_verified = False
        self.save()
        context = {
            'site_name':'Bsoft',
            'logo_url': config("LOGO_URL", None),
            'first_name':self.name,
            'email':self.email,
            'verification_link':f'{verification_link}',
            'support_email':'support@b-soft.xyz',
            'site_url':f'{base_url}',
            'name':self.name,
            
        }
        template = 'activation_mail.html'
        subject = 'Email Verification'
        send_email_on_delay(template, context, subject, self.email)
        

    def __str__(self):
        return f"{self.id} - {self.name}"


class UserOTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='user_otp')
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = UserOTPManager()
    
    def __str__(self):
        return f"{self.user.name }: {self.otp}"

class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='user_address')
    country = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    zip_code = models.CharField(max_length=100, null=True, blank=True)
    area = models.CharField(max_length=100, null=True, blank=True)
    street = models.CharField(max_length=100, null=True, blank=True)
    house = models.CharField(max_length=100, null=True, blank=True)
    address = models.TextField( null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.id}-{self.user.email}"

