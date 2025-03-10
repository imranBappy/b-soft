import graphene
from apps.base.utils import get_object_by_kwargs
from .objectType import UserType, AddressType, RoleType
from graphene_django.filter import DjangoFilterConnectionField
from .models import User, Address
from backend.authentication import isAuthenticated
from django.contrib.auth.models import Group

class Query(graphene.ObjectType):
    users = DjangoFilterConnectionField(UserType)
    me = graphene.Field(UserType)
    user = graphene.Field(UserType,id=graphene.ID(required=False), email=graphene.String(required=False), phone=graphene.String(required=False))
    address = graphene.Field(AddressType, id=graphene.ID(required=False), user=graphene.ID(required=False))
    addresses = DjangoFilterConnectionField(AddressType)
    roles = graphene.List(RoleType)

    @isAuthenticated()
    def resolve_users(self, info,  **kwargs):
        return User.objects.all()
    
    @isAuthenticated()
    def resolve_me(self, info):
        user = info.context.User
        return user
    
    def resolve_user(self, info, id=None, email=None, phone=None):
        try:
            print(id, email, phone)
            if id:
                print('id')
                return User.objects.get(id=id)
            elif email:
                print('email')
                return User.objects.get(email=email)
            elif phone:
                return User.objects.get(phone=phone)
            raise User.DoesNotExist
        except User.DoesNotExist:
            raise Exception("User  not found.")
    
       
    def resolve_address(self, info, id=None, user=None):
        if id:
            return get_object_by_kwargs(Address, {'id': id})
        elif user:
            return get_object_by_kwargs(Address, {'user': user})
        
        return get_object_by_kwargs(Address, { 'user':user, 'id':id })
     
    def resolve_addresses(self, info, **kwargs):
        return Address.objects.all()
    
    def resolve_roles(self, info, **kwargs):
        return Group.objects.all()

