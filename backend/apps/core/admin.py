from django.contrib import admin
from apps.core.models import Slider, StaticPage, WebsiteInfo, ContactUs


@admin.register(Slider)
class SliderAdmin(admin.ModelAdmin):
    list_display =['id']

@admin.register(WebsiteInfo)
class WebsiteInfoAdmin(admin.ModelAdmin):
    list_display =['id']

@admin.register(StaticPage)
class StaticPageAdmin(admin.ModelAdmin):
    list_display =['id']

@admin.register(ContactUs)
class ContactUsAdmin(admin.ModelAdmin):
    list_display =['id','name', 'email']
    search_fields =['id', 'name', 'email']