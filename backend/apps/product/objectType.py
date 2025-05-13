from graphene_django.types import DjangoObjectType
from apps.product.models import Credential, Software, OrderProductAttribute, FAQ, Review, Product, Category,Coupon, Order,ProductAccess, ProductDescription,Attribute,AttributeOption, OrderProduct, Payment
from apps.product.filters import CredentialFilter,SoftwareFilter, OrderProductAttributeFilter, FAQFilter, ReviewFilter, CouponFilter, CredentialFilter, AttributeOptionFilter, AttributeFilter, ProductDescriptionFilter, ProductFilter, CategoryFilter, OrderFilter, OrderProductFilter ,  PaymentFilter
from backend.count_connection import CountConnection
from apps.accounts.objectType import UserType
import graphene

class CredentialType(DjangoObjectType):
    id = graphene.ID(required=True)
    class Meta:
        model = Credential
        filterset_class =CredentialFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection 
class OrderProductAttributeType(DjangoObjectType):
    id = graphene.ID(required=True)
    class Meta:
        model = OrderProductAttribute
        filterset_class =OrderProductAttributeFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection 

class ReviewType(DjangoObjectType):
    id = graphene.ID(required=True)
    class Meta:
        model = Review
        filterset_class =ReviewFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection 
class FAQType(DjangoObjectType):
    id = graphene.ID(required=True)
    class Meta:
        model = FAQ
        filterset_class =FAQFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection 

class  ProductDescriptionType(DjangoObjectType):
    id = graphene.ID(required=True)
    class Meta:
        model =  ProductDescription
        filterset_class = ProductDescriptionFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection 

class  AttributeType(DjangoObjectType):
    id = graphene.ID(required=True)
    class Meta:
        model =  Attribute
        filterset_class = AttributeFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection  

class  AttributeOptionType(DjangoObjectType):
    id = graphene.ID(required=True)
    class Meta:
        model =  AttributeOption
        filterset_class = AttributeOptionFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection  

class  CredentialType(DjangoObjectType):
    id = graphene.ID(required=True)
    class Meta:
        model =  Credential
        filterset_class = CredentialFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection  

class CouponType(DjangoObjectType):
    id = graphene.ID(required=True)
    class Meta:
        model = Coupon
        filterset_class = CouponFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection      

class ProductType(DjangoObjectType):
    id = graphene.ID(required=True)
    price = graphene.Float()
    class Meta:
        model = Product
        filterset_class = ProductFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection
        

class CategoryType(DjangoObjectType):
    id = graphene.ID(required=True)
    is_category = graphene.Boolean()
    class Meta:
        model = Category
        filterset_class = CategoryFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection

class SubCategoryType(CategoryType):
    parent_id = graphene.ID(required=True)
    class Meta:
        model = Category
        filterset_class = CategoryFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection

class OrderType(DjangoObjectType):
    id = graphene.ID(required=True)
    user = graphene.Field(UserType)
    class Meta:
        model = Order
        filterset_class = OrderFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection

class OrderProductType(DjangoObjectType):
    id = graphene.ID(required=True)
    class Meta:
        model = OrderProduct
        filterset_class = OrderProductFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection


class PaymentType(DjangoObjectType):
    id = graphene.ID(required=True)
    class Meta:
        model = Payment
        filterset_class = PaymentFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection        


class ProductAccessType(DjangoObjectType):
    id = graphene.ID(required=True)
    class Meta:
        model = ProductAccess
        connection_class = CountConnection        
        

class SoftwareType(DjangoObjectType):
    id = graphene.ID(required=True)
    class Meta:
        model = Software
        filterset_class = SoftwareFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection  
