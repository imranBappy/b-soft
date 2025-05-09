from django.contrib import admin
# Register your models here.
from apps.product.models import ProductAccess, FAQ, Review, Category,ProductDescription,Attribute,AttributeOption, Payment, Product, Order, OrderProduct

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
    list_display = ('id','name')
    search_fields = ['name']

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