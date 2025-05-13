import graphene
from apps.accounts.models import UserRole
from apps.product.models import Credential, Software, ProductAccess, Attribute, OrderProductAttribute, FAQ, ProductDescription, Review, Product, Category, Order, OrderProduct, Payment
from apps.base.utils import get_object_by_kwargs
from apps.product.objectType import CredentialType, SoftwareType, ProductAccessType, OrderProductAttributeType, ReviewType, FAQType, CredentialType, AttributeOptionType, AttributeType, ProductDescriptionType, CouponType, CategoryType, ProductType, SubCategoryType, PaymentType, OrderType, OrderProductType
from graphene_django.filter import DjangoFilterConnectionField
from graphql import GraphQLError
from django.utils import timezone


from backend.authentication import isAuthenticated


class Query(graphene.ObjectType):
    order_product_attribute = graphene.Field(OrderProductAttributeType, id=graphene.ID(required=True))
    order_product_attributes = DjangoFilterConnectionField(OrderProductAttributeType)

    faq = graphene.Field(FAQType, id=graphene.ID(required=True))
    faqs = DjangoFilterConnectionField(FAQType)

    review = graphene.Field(ReviewType, id=graphene.ID(required=True))
    reviews = DjangoFilterConnectionField(ReviewType)

    credential = graphene.Field(CredentialType, id=graphene.ID(required=True))
    credentials = DjangoFilterConnectionField(CredentialType)
    
    attribute_option = graphene.Field(AttributeOptionType, id=graphene.ID(required=True))
    attribute_option = DjangoFilterConnectionField(AttributeOptionType)
    
    attribute = graphene.Field(AttributeType, id=graphene.ID(required=True))
    attributes = DjangoFilterConnectionField(AttributeType)
    
    product_description = graphene.Field(ProductDescriptionType, id=graphene.ID(required=True))
    product_descriptions = DjangoFilterConnectionField(ProductDescriptionType)
    
    coupon = graphene.Field(CouponType, id=graphene.ID(required=True))
    coupons = DjangoFilterConnectionField(CouponType)
    
    category = graphene.Field(CategoryType, id=graphene.ID(required=True))
    categories = DjangoFilterConnectionField(CategoryType)
    
    subcategory = graphene.Field(CategoryType, id=graphene.ID(required=True))
    subcategories = DjangoFilterConnectionField(SubCategoryType, parent_id=graphene.ID(required=True))
    
    product = graphene.Field(ProductType, id=graphene.ID(required=True))
    products = DjangoFilterConnectionField(ProductType)
    
    order = graphene.Field(OrderType, id=graphene.ID(required=True))
    orders = DjangoFilterConnectionField(OrderType)
    
    order_product = graphene.Field(OrderProductType, id=graphene.ID(required=True))
    order_products = DjangoFilterConnectionField(OrderProductType)
    

    payment = graphene.Field(PaymentType, id=graphene.ID(required=False), order=graphene.ID(required=False))
    payments = DjangoFilterConnectionField(PaymentType)

    access = graphene.Field(ProductAccessType, id=graphene.ID(required=True))

    softwares = DjangoFilterConnectionField(SoftwareType )
    software  = graphene.Field(SoftwareType, id=graphene.ID(required=True))

    credentials = DjangoFilterConnectionField(CredentialType )
    credential  = graphene.Field(CredentialType, id=graphene.ID(required=True))

    @isAuthenticated([UserRole.ADMIN]) 
    def resolve_credential(self, info, id):
        return get_object_by_kwargs(Credential, {"id": id})

    @isAuthenticated([UserRole.ADMIN])  
    def resolve_credentials(self, info, **kwargs):
        return Credential.objects.all()

    def resolve_software(self, info, id):
        return get_object_by_kwargs(Software, {"id": id})
     
    def resolve_softwares(self, info, **kwargs):
        return Software.objects.all()
    
    def resolve_product_description(self, info, id):
        return get_object_by_kwargs(ProductDescription, {"id": id})

    def resolve_order_product_attribute(self, info, id):
        return get_object_by_kwargs(OrderProductAttribute, {"id": id})
     
    def resolve_order_product_attributes(self, info, **kwargs):
        return OrderProductAttribute.objects.all()

    def resolve_attribute(self, info, id):
        return get_object_by_kwargs(Attribute, {"id": id})
     
    def resolve_attributes(self, info, **kwargs):
        return Attribute.objects.all()
    
    def resolve_review(self, info, id):
        return get_object_by_kwargs(Review, {"id": id})
     
    def resolve_reviews(self, info, **kwargs):
        return Review.objects.all()

    def resolve_faq(self, info, id):
        return get_object_by_kwargs(FAQ, {"id": id})
     
    def resolve_faqs(self, info, **kwargs):
        return FAQ.objects.all()

    def resolve_category(self, info, id):
        return get_object_by_kwargs(Category, {"id": id})
     
    def resolve_categories(self, info ,**kwargs):
        return Category.objects.order_by("-created_at")

    def resolve_subcategory(self, info, id):
        return get_object_by_kwargs(Category, {"id": id})
     
    def resolve_subcategories(self, info, **kwargs):
        return Category.objects.filter(parent=kwargs.get("parent_id"))

    def resolve_product(self, info, id):
        return get_object_by_kwargs(Product, {"id": id})
     
    def resolve_products(self, info, **kwargs):
        return Product.objects.all()
    
    @isAuthenticated()
    def resolve_order(self, info, id):
        return get_object_by_kwargs(Order, {"id": id})

    @isAuthenticated() 
    def resolve_orders(self, info, **kwargs):
        user = info.context.User
        if user.role:
            if user.role.name == UserRole.CUSTOMER:
                print(Order.objects.all().values() )
                return Order.objects.filter(user=user) 
            
            if user.role.name == UserRole.ADMIN:
                return Order.objects.all() 
        return []


         
    
    @isAuthenticated()
    def resolve_order_product(self, info, id):
        return get_object_by_kwargs(OrderProduct, {"id": id})

    @isAuthenticated() 
    def resolve_order_products(self, info, **kwargs):
        return OrderProduct.objects.all()
    
    @isAuthenticated()
    def resolve_payment(self, info, id, order=None):
        if order:
            result =  get_object_by_kwargs(Payment, { 'order': order})
            return result
        return get_object_by_kwargs(Payment, {'id': id})

    @isAuthenticated() 
    def resolve_payments(self, info, **kwargs):
        return Payment.objects.all()
    
    @isAuthenticated()
    def resolve_access(self, info, id):
        product_access = get_object_by_kwargs(ProductAccess, {"id": id})
  
        if product_access.is_expired:
            raise GraphQLError("Date expired!")

    
        if product_access.access_count >= product_access.access_limit:
            product_access.is_expired = True
            product_access.save()  # Don't forget to save the updated is_expired field
            raise GraphQLError("You don't have any access limit left")

        now = timezone.now()
        if product_access.expired_date < now:
            product_access.is_expired = True
            product_access.save()  # Don't forget to save the updated is_expired field
            raise GraphQLError("Date expired!")

        product_access.access_count += 1
        product_access.save()
        
        return product_access

    
    
    def elastic_search(self, info, **kwargs):
        pass
    
