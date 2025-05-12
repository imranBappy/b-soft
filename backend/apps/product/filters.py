from apps.product.models import Software, OrderProductAttribute, FAQ, Review, Product, Category,Coupon, Order,ProductAccess, ProductDescription,Attribute,AttributeOption, OrderProduct, Payment
import django_filters as filters
from apps.base.filters import BaseFilterOrderBy
from django.db.models import Q
from datetime import timedelta
from apps.accounts.models import  Address

 
class SoftwareFilter(BaseFilterOrderBy):
    class Meta:
        model = Software
        fields = '__all__'

class OrderProductAttributeFilter(BaseFilterOrderBy):
    class Meta:
        model = OrderProductAttribute
        fields = '__all__'

class ReviewFilter(BaseFilterOrderBy):
    product =filters.CharFilter( lookup_expr="exact",  field_name="product")
    class Meta:
        model = Review
        fields = '__all__'
class FAQFilter(BaseFilterOrderBy):
    class Meta:
        model = FAQ
        fields = '__all__'

class ProductFilter(BaseFilterOrderBy):
    tag = filters.CharFilter(lookup_expr="exact", field_name="tag")
    category = filters.BaseInFilter(lookup_expr="in", field_name="category")
    search = filters.CharFilter(method="filter_search")
    is_active = filters.BooleanFilter(field_name="is_active")
    created_at_start = filters.DateFilter(method='filter_created_at_range', field_name='start')
    created_at_end = filters.DateFilter(method='filter_created_at_range', field_name='end')
    price = filters.NumberFilter(lookup_expr="gte", field_name="price")
    price_lte = filters.NumberFilter(lookup_expr="lte", field_name="price")
    order_by_price = filters.CharFilter(method="filter_order_by_price", lookup_expr="exact")
    order_by_created_at = filters.CharFilter(method="filter_order_by_created_at", lookup_expr="exact")
    
    class Meta:
        model = Product
        fields = '__all__'

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(name__icontains=value) 
        )

    def filter_created_at_range(self, queryset, name, value):
        if name == 'start':
            return queryset.filter(created_at__gte=value)
        if name == 'end':
            return queryset.filter(created_at__lte=value + timedelta(days=1))
        return queryset
    
    # # order by price
    def filter_order_by_price(self, queryset, name, value):
        return queryset.order_by(value)
    
    # # order by created at
    def filter_order_by_created_at(self, queryset, name, value):
        return queryset.order_by(value)

class CategoryFilter(BaseFilterOrderBy):
    name = filters.CharFilter(lookup_expr="icontains", field_name="name")
    search = filters.CharFilter(method="filter_search")
    is_category = filters.BooleanFilter(method="filter_is_category")
    parent = filters.NumberFilter(lookup_expr="exact", field_name="parent")
    class Meta:
        model = Category
        fields = '__all__'
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(Q(name__icontains=value))

    def filter_is_category(self, queryset, name, value):
        return queryset.filter(parent=None) if value else queryset
    
class OrderFilter(BaseFilterOrderBy):
    search = filters.CharFilter(method="order_search")
    class Meta:
        model = Order
        fields = '__all__'
    
    def order_search(self, queryset, name, value): 
        if not value :
            return queryset.filter(user__isnull=False)
        
        return queryset.filter(
            Q(user__email__icontains=value) | 
            Q(user__name__icontains=value) |
            Q(user__phone__icontains=value) |
            Q(order_id__icontains=value)
        )
        
class OrderProductFilter(BaseFilterOrderBy):
    
    order = filters.NumberFilter(lookup_expr="exact", field_name="order")
    class Meta:
        model = OrderProduct
        fields = '__all__'

class AddressFilter(BaseFilterOrderBy):
    class Meta:
        model = Address
        fields = '__all__'

class PaymentFilter(BaseFilterOrderBy):
    class Meta:
        model = Payment
        fields = '__all__'
    
    search = filters.CharFilter(method="filter_search")
    def filter_search(self, queryset, _, value):
        return queryset.filter(
            Q(order__order_id__icontains=value) |
            Q(trx_id__icontains=value)
        )
        
    
class ProductDescriptionFilter(BaseFilterOrderBy):
    product = filters.NumberFilter(lookup_expr="exact", field_name="product")
    tag = filters.NumberFilter(lookup_expr="exact", field_name="tag")
    search = filters.CharFilter(method="filter_search")
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(label__icontains=value) |
            Q(tag__icontains=value) |
            Q(description__icontains=value)|
            Q(product__product_id__icontains=value)|
            Q(product__product_name__icontains=value)
        )
    class Meta:
        model = ProductDescription
        fields = '__all__'    

class AttributeFilter(BaseFilterOrderBy):
    product = filters.CharFilter(lookup_expr='exact', field_name='product')
    class Meta:
        model = Attribute
        fields = '__all__'    

class AttributeOptionFilter(BaseFilterOrderBy):
    class Meta:
        model = AttributeOption
        fields = '__all__'   
        
        
class CredentialFilter(BaseFilterOrderBy):
    class Meta:
        model = ProductAccess
        fields = '__all__'
        
class CouponFilter(BaseFilterOrderBy):
    class Meta:
        model = Coupon
        fields = '__all__'
        
