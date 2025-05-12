from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Address, UserOTP

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id','name', 'email', 'role', 'phone')

    
@admin.register(UserOTP)
class UserOTPAdmin(admin.ModelAdmin):
    list_display = ('id','otp')

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ('id','user','country','state','city','street','zip_code')