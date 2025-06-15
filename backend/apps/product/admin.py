from django.contrib import admin
# Register your models here.
from apps.product.models import Credential, Software, ProductAccess, FAQ, Review, Category,ProductDescription,Attribute,AttributeOption, Payment, Product, Order, OrderProduct
# Credential

@admin.register(Credential)
class CredentialAdmin(admin.ModelAdmin):
    list_display =['id','name','download',"note"]
    search_fields = ['download']
    list_filter = ['name']
    list_per_page = 10
    list_editable = ['name']

    

@admin.register(Software)
class SoftwareAccessAdmin(admin.ModelAdmin):
    list_display =['id','name',"buy_link"]
    search_fields = ['name']

@admin.register(ProductAccess)
class ProductAccessAdmin(admin.ModelAdmin):
    list_display =['id','download',"is_expired","access_count"]
    search_fields = ['download']
    list_filter = ['is_expired']
@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id','content')
    search_fields = ['content']

@admin.register(FAQ)
class FAQAdmin(admin.ModelAdmin):
    list_display = ('id','question')
    search_fields = ['question']


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id','name')
    search_fields = ['name']

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'slug', 'price', 'is_active']
    search_fields = ['name']
    prepopulated_fields = {'slug': ('name',)}  # Optional auto-fill on admin add


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id','user','total_price')
    search_fields = ['user__email']

@admin.register(OrderProduct)
class OrderProductAdmin(admin.ModelAdmin):
    list_display = ('id','quantity','price', 'order','product', )
    search_fields = ['order__user__email', 'product__name']



@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id','status','payment_method']

@admin.register(ProductDescription)
class ProductDescriptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'label']

@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
    list_display = ['id','name']
    
@admin.register(AttributeOption)
class AttributeOptionAdmin(admin.ModelAdmin):
    list_display = ['id','option']