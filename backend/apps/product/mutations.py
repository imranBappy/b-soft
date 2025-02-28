import graphene
from apps.base.utils import generate_order_id, get_object_or_none, generate_message, create_graphql_error
from .objectType import CategoryType, ProductType, OrderProductType, OrderType
from apps.base.utils import get_object_by_kwargs
from backend.authentication import isAuthenticated

from datetime import datetime
from graphene_django.forms.mutation import DjangoFormMutation
from apps.product.forms import OrderProductAttributeForm, ReviewForm,FAQForm, ProductForm, CategoryForm, OrderForm, OrderProductForm, PaymentForm, CredentialForm, AttributeOptionForm, ProductDescriptionForm, AttributeForm
from apps.product.models import ORDER_STATUS_CHOICES, OrderProductAttribute,FAQ, Review, Category, Product, Order, OrderProduct,  Payment, ProductAccess, AttributeOption, Attribute, ProductDescription
from apps.accounts.models import Address, UserRole, User
import json 
from django.utils.timezone import now
from datetime import timedelta
from graphql import GraphQLError
import random
import string
import uuid
from django.conf import settings
from apps.base.utils import generate_otp
from django.db import transaction

base_url = settings.WEBSITE_URL

class OrderProductAttributeCUD(DjangoFormMutation):
    message = graphene.String()
    success = graphene.Boolean()
    
    class Meta:
        form_class = OrderProductAttributeForm
    
    @isAuthenticated()
    def mutate_and_get_payload(self, info, **input):
            
        instance = get_object_or_none(OrderProductAttribute, id=input.get('id'))
        form = OrderProductAttributeForm(input, instance=instance)
        if not form.is_valid():
            return create_graphql_error(form)

        orderProductAttribute = form.save()

        return OrderProductAttributeCUD(
                message="Created successfully",
                success=True,
            )
        

class CategoryCUD(DjangoFormMutation):
    message = graphene.String()
    success = graphene.Boolean()
    category = graphene.Field(CategoryType)
    
    class Meta:
        form_class = CategoryForm
    
    # @isAuthenticated(['Manager', 'Admin'])
    def mutate_and_get_payload(self, info, **input):
            
        instance = get_object_or_none(Category, id=input.get('id'))
        form = CategoryForm(input, instance=instance)
        if form.is_valid():
            category = form.save()
            return CategoryCUD(
                message="Created successfully",
                success=True,
                category=category
            )
        


class ProductDescriptionCUD(DjangoFormMutation):
    success = graphene.Boolean()

    class Meta:
        form_class = ProductDescriptionForm

    def mutate_and_get_payload(self, info, **input):
        instance = get_object_or_none(ProductDescription, id=input.get("id"))
        form = ProductDescriptionForm(input, instance=instance)
        if not form.is_valid():
            create_graphql_error(form.errors) 
            
        form.save()
        return ProductDescriptionCUD(  success=True )  

class AttributeCUD(DjangoFormMutation):
    success = graphene.Boolean()

    class Meta:
        form_class = AttributeForm

    def mutate_and_get_payload(self, info, **input):
        instance = get_object_or_none(Attribute, id=input.get("id"))
        form = AttributeOptionForm(input, instance=instance)
        if not form.is_valid():
            create_graphql_error(form.errors) 
            
        form.save()
        return AttributeCUD(  success=True )  
class AttributeOptionCUD(DjangoFormMutation):
    success = graphene.Boolean()

    class Meta:
        form_class = AttributeOptionForm

    def mutate_and_get_payload(self, info, **input):
        instance = get_object_or_none(AttributeOption, id=input.get("id"))
        form = AttributeOptionForm(input, instance=instance)
        if not form.is_valid():
            create_graphql_error(form.errors) 
            
        form.save()
        return AttributeOptionCUD(  success=True )  
    

class CredentialCUD(DjangoFormMutation):
    success = graphene.Boolean()

    class Meta:
        form_class = CredentialForm

    def mutate_and_get_payload(self, info, **input):
        instance = get_object_or_none(ProductAccess, id=input.get("id"))
        form = CredentialForm(input, instance=instance)
        if not form.is_valid():
            create_graphql_error(form.errors) 
            
        form.save()
        return CredentialCUD(  success=True )  


class ProductCUD(DjangoFormMutation):
    message = graphene.String()
    success = graphene.Boolean()
    product = graphene.Field(ProductType)

    class Meta:
        form_class = ProductForm

    def mutate_and_get_payload(self, info, **input):
        instance = get_object_or_none(Product, id=input.get("id"))
        form = ProductForm(input, instance=instance)
        if not form.is_valid():
            create_graphql_error(form) 
            
        product = form.save()
        return ProductCUD(
                message="Created successfully!", 
                success=True,
                product=product
            ) 
        
class DeleteProduct(graphene.Mutation):
    message = graphene.String()
    success = graphene.Boolean()    
    class Arguments:
        id = graphene.ID(required=True)
    def mutate(self, info, id):
        product = get_object_by_kwargs(Product, {"id": id})
        product.delete()
        return DeleteProduct(success=True, message="Deleted!")

class OrderCUD(DjangoFormMutation):
    message = graphene.String()
    success = graphene.Boolean()
    order = graphene.Field(OrderType)
    
    class Meta:
        form_class = OrderForm

    def mutate_and_get_payload(self, info, **input):
        instance = get_object_or_none(Order, id=input.get('id'))
        form = OrderForm(input, instance=instance)

        if not input.get('order_id'):
            random_string = ''.join(random.choices(string.ascii_uppercase + string.digits, k=9))
            order_id = f"#{random_string}"
            input['order_id'] = order_id
        
        if not form.is_valid()  :
            return create_graphql_error(form.errors) 
        order = form.save()
        return OrderCUD(message="Created successfully!", success=True, order=order)
    


# Order 
class OrderProductAttributeInput(graphene.InputObjectType):
    attribute_id = graphene.ID(required=True)
    option_id = graphene.ID(required=True)

class OrderProductInput(graphene.InputObjectType):
    product_id = graphene.ID(required=True)
    quantity = graphene.Int(required=True)
    attributes = graphene.List(OrderProductAttributeInput, required=False)  # Variants
class OrderPaymentInput(graphene.InputObjectType):
    account_number = graphene.String(required=True)
    trx_id = graphene.String(required=False)
    payment_method =  graphene.String(required=True)
    
class CreateOrderInput(graphene.InputObjectType):
    user_email = graphene.String(required=True)
    user_name = graphene.String(required=True)
    phone = graphene.String(required=False)
    products = graphene.List(OrderProductInput, required=True)
    payment = graphene.Field(OrderPaymentInput , required=True)

def generate_random_password(length=10):
    characters = string.ascii_letters + string.digits
    return ''.join(random.choice(characters) for _ in range(length))

class CreateOrder(graphene.Mutation):
    class Arguments:
        input = CreateOrderInput(required=True)

    success = graphene.Boolean()

    def mutate(self, info, input):
        try:
            user = User.objects.filter(email=input.user_email).first()
            random_password = generate_random_password()
            if not user:
                user = User.objects.create(
                    email=input.user_email,
                    name=input.user_name,
                    phone=input.phone,
                    password=random_password,  
                    is_verified=True
                )
                # gen_otp = generate_otp()
                # user.send_email_verification(
                #     gen_otp, base_url
                # )

                
            
            if not input.products:
                raise GraphQLError("Order must contain at least one product.")

            if not input.payment:
                raise GraphQLError("Order must contain payment information.")
            
            if not input.payment.payment_method:
                raise GraphQLError("Select payment method")

            if not input.payment.account_number:
                raise GraphQLError("Enter payment account number")

            with transaction.atomic():
                order = Order.objects.create(
                    user=user,
                    total_price=0,  # Updated later
                    status="PENDING",
                    is_cart=False,
                    order_id = generate_order_id()
                )

                total_price = 0
                extra_price = 0
                for item in input.products:
                    product = Product.objects.filter(id=item.product_id).first()
                    if not product:
                        raise GraphQLError(f"Product with ID {item.product_id} not found.")

                    if item.quantity <= 0:
                        raise GraphQLError(f"Quantity must be at least 1 for product {product.id}.")
                    
                    base_price = product.price * item.quantity
                    price = product.price
                    if(product.offer_price):
                        base_price = product.offer_price * item.quantity
                        price = product.offer_price

                    total_price+=base_price
                 


                    order_product = OrderProduct.objects.create(
                        order=order,
                        product=product,
                        quantity=item.quantity,
                        price=price
                    )

                    # Handle product attributes (variants)
                    if item.attributes:
                        for attr in item.attributes: 
                            attribute = Attribute.objects.get(id=attr.attribute_id)  # ✅ Fetch the Attribute instance
                            option = AttributeOption.objects.get(id=attr.option_id)  # ✅ Fetch the Option instance

                            if not attribute or not option:
                                raise GraphQLError(f"Invalid variant/option for product {product.id}.")

                            extra_price += option.extra_price * item.quantity

                            OrderProductAttribute.objects.create(
                                order_product=order_product,
                                attribute=attribute,
                                option=option,
                                extra_price=option.extra_price
                            )

                order.total_price = total_price + extra_price
                order.save()
                Payment.objects.create(
                        order=order,
                        amount=order.total_price,
                        payment_method=input.payment.payment_method,
                        account_number=input.payment.account_number,
                        trx_id = input.payment.trx_id,
                    )

            return CreateOrder(success=True)
        except Exception as e:
            print(e)
            raise GraphQLError(e)



class OrderProductCUD(DjangoFormMutation):
    success = graphene.Boolean()
    id = graphene.ID()
    class Meta:
        form_class = OrderProductForm

    def mutate_and_get_payload(self, info, **input):
        instance = get_object_or_none(OrderProduct, id=input.get('id'))
        form = OrderProductForm(input, instance=instance)
        if form.is_valid():
            order = form.save()
            return OrderProductCUD( success=True, id=order.id)


class PaymentCUD(DjangoFormMutation):
    success = graphene.Boolean()
    class Meta:
        form_class = PaymentForm

    def mutate_and_get_payload(self, info, **input):
        instance = get_object_or_none(Payment, id=input.get('id'))
        form = PaymentForm(input, instance=instance)
            
        if form.is_valid():
            order = form.save()
            return PaymentCUD( success=True)
        create_graphql_error(form.errors)
class ReviewCUD(DjangoFormMutation):
    success = graphene.Boolean()

    class Meta:
        form_class = ReviewForm

    @isAuthenticated([UserRole.CUSTOMER, UserRole.ADMIN])
    def mutate_and_get_payload(self, info, **input):
        try:
            user_id = info.context.User.id
            input["user"] = user_id

            # Check if review instance exists for update
            instance = get_object_or_none(Review, id=input.get("id"))

            # Validate form
            form = ReviewForm(input, instance=instance)
            if not form.is_valid():
                create_graphql_error(form.errors) 

            # Check if user has purchased the product
            product_id = input["product"]
            has_purchased = Order.objects.filter(
                user=user_id,
                status__in=["CONFIRMED", "DELIVERED"],
                items__product_id=product_id
            ).exists()


            if not has_purchased:
                raise GraphQLError("You cannot review a product without purchasing it.")

            # Save review if user has purchased the product
            form.save()
            return ReviewCUD(success=True)

        except Exception as e:
            raise GraphQLError(e)



class DeleteReview(graphene.Mutation):
    message = graphene.String()
    success = graphene.Boolean()    
    class Arguments:
        id = graphene.ID(required=True)
    def mutate(self, info, id):
        review = get_object_by_kwargs(Review, {"id": id})
        review.delete()
        return DeleteReview(success=True, message="Deleted!")
class FAQCUD(DjangoFormMutation):
    success = graphene.Boolean()
    class Meta:
        form_class = FAQForm
    
    def mutate_and_get_payload(self, info, **input):
        instance = get_object_or_none(FAQ, id=input.get("id"))
        form = FAQForm(input, instance=instance)
        if not form.is_valid():
            create_graphql_error(form.errors) 
            
        form.save()
        return FAQCUD(success=True ) 

class Mutation(graphene.ObjectType):
    review_cud = ReviewCUD.Field()
    delete_review = DeleteReview.Field()
    faq_cud = FAQCUD.Field()

    product_cud = ProductCUD.Field()
    delete_product = DeleteProduct.Field()
    category_cud = CategoryCUD.Field()
    order_cud = OrderCUD.Field()
    order_product_cud = OrderProductCUD.Field()
    payment_cud = PaymentCUD.Field()
    order_product_attribute_cud = OrderProductAttributeCUD.Field()
    product_description_cud = ProductDescriptionCUD.Field()
    create_order = CreateOrder.Field()
    