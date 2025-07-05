import graphene
from apps.base.utils import generate_order_id, get_object_or_none, create_graphql_error, generate_otp
from .objectType import CategoryType, ProductType, OrderType, CredentialType, ProductAccessType
from apps.base.utils import get_object_by_kwargs
from backend.authentication import isAuthenticated,TokenManager

from graphene_django.forms.mutation import DjangoFormMutation
from apps.product.forms import OrderProductAttributeForm, ReviewForm,FAQForm, ProductForm, CategoryForm, OrderForm, OrderProductForm, PaymentForm, ProductAccessForm, AttributeOptionForm, ProductDescriptionForm, AttributeForm
from apps.product.models import OrderProductAttribute,FAQ, Review, Category, Product, Order, OrderProduct,  Payment, ProductAccess, AttributeOption, Attribute, ProductDescription
from apps.accounts.models import  UserRole, User
from graphql import GraphQLError
import random
import string
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from django.contrib.auth.models import Group
 

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


class ProductAttributeOptionInput(graphene.InputObjectType):
    id = graphene.ID(required=False)
    option = graphene.String(required=True)
    message = graphene.String(required=False)
    extra_price = graphene.Decimal(required=True)
    photo = graphene.String(required=False)

class ProductAttributeInput(graphene.InputObjectType):
    id = graphene.ID(required=False)
    product = graphene.ID(required=True)
    name = graphene.String(required=True)
    options = graphene.List(ProductAttributeOptionInput, required=False)  # Variants


class ProductAttributeAndOptonCUD(graphene.Mutation):
    """Mutation to create or update a product attribute and its options."""
    
    class Arguments:
        input = ProductAttributeInput(required=True)
    
    success = graphene.Boolean()

    @isAuthenticated([UserRole.ADMIN])
    def mutate(self,info, input):
        with transaction.atomic():
            """
            Handle creation or update of a product attribute and its options.
            
            Args:
                root: The root object (unused here).
                info: GraphQL execution info.
                input: The ProductAttributeInput object containing attribute and option data.
            
            Returns:
                ProductAttributeAndOptonCUD instance with the created or updated attribute.
            
            Raises:
                Exception: If form validation fails.
            """
            # Step 1: Handle the attribute
            attribute_id = input.get('id')
            if attribute_id:
                # Update existing attribute
                attribute = Attribute.objects.get(id=attribute_id)
            else:
                # Create new attribute
                attribute = Attribute()

            # Validate and save attribute using AttributeForm
            attribute_form = AttributeForm(
                data={
                    'product': input['product'],  # Graphene.ID as string, form handles ForeignKey
                    'name': input['name'],
                },
                instance=attribute
            )
            if not attribute_form.is_valid():
                raise create_graphql_error(attribute_form)
            attribute = attribute_form.save()

            # Step 2: Handle options
            # Get list of option IDs from input (for updates), treating None as empty list
            attributes_options_input = input.get('options') or []
            input_option_ids = [opt['id'] for opt in attributes_options_input if 'id' in opt]
            
            # Get existing options for the attribute
            existing_options = attribute.attribute_options.all()

            # Delete options not present in the input (for updates)
            for existing_option in existing_options:
                if str(existing_option.id) not in input_option_ids:
                    existing_option.delete()

            # Create or update options based on input
            for opt_input in attributes_options_input:
                if 'id' in opt_input:
                    # Update existing option
                    option = AttributeOption.objects.get(id=opt_input['id'])
                else:
                    # Create new option linked to the attribute
                    option = AttributeOption(attribute=attribute)

                # Validate and save option using AttributeOptionForm
                option_form = AttributeOptionForm(
                    data={
                        'option': opt_input['option'],
                        'message': opt_input.get('message'),
                        'extra_price': opt_input['extra_price'],
                        'photo': opt_input.get('photo'),
                        'attribute':attribute.id
                    },
                    instance=option
                )
                if not option_form.is_valid():
                    raise create_graphql_error(option_form)
                option_form.save()

            # Return the mutation result
            return ProductAttributeAndOptonCUD(success=True)

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
    

class ProductAccessCUD(DjangoFormMutation):
    success = graphene.Boolean()

    class Meta:
        form_class = ProductAccessForm

    @isAuthenticated([UserRole.ADMIN, UserRole.MANAGER])
    def mutate_and_get_payload(self, info, **input):
        instance = get_object_or_none(ProductAccess, id=input.get("id"))
        form = ProductAccessForm(input, instance=instance)
      
        if not form.is_valid():
            create_graphql_error(form.errors) 
        form.save()
        
        item = get_object_or_none(OrderProduct, id=input.get("item"))
        if item.order.status != 'COMPLETED':
            item.order.status = 'COMPLETED'
            item.order.save()
            
        return ProductAccessCUD(success=True )  


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
            
            if not input.products:
                raise GraphQLError("Order must contain at least one product.")

            if not input.payment:
                raise GraphQLError("Order must contain payment information.")
            
            if not input.payment.payment_method:
                raise GraphQLError("Select payment method")

            if not input.payment.account_number:
                raise GraphQLError("Enter payment account number")

            with transaction.atomic():
                auth_header = info.context.META.get('HTTP_AUTHORIZATION')
                isUserAuthenticated = False
                try :
                    if auth_header:
                        parts = auth_header.split(" ")
                        if len(parts) != 2 or parts[0].lower() != "bearer":
                            raise GraphQLError("Invalid authorization header format.")
                        
                        token = parts[1]
                        decoded_token  = TokenManager.decode_token(token)
                        user_email = decoded_token.get('email')
                        user = User.objects.get(email=user_email)
                        isUserAuthenticated = True

                except Exception as e:
                    isUserAuthenticated = False
                    raise GraphQLError(f"Authentication failed: {str(e)}")
            
                user = User.objects.filter(email=input.user_email).first()

                
                if(not isUserAuthenticated and user):
                    return GraphQLError("User is exist already.")
                
                if not user:
                    random_password = generate_random_password()
                    role = Group.objects.get(name="CUSTOMER")
                    user = User.objects.create(
                        email=input.user_email,
                        name=input.user_name,
                        phone=input.phone,
                        password=random_password,  
                        is_verified=True,
                        role=role
                    )
                    gen_otp = generate_otp()
                    user.send_email_verification(
                        gen_otp, base_url
                    )

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
                order.send_email()
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


class ProductAccessInput(graphene.InputObjectType):
    item = graphene.ID(required=True)
    username = graphene.String(required=False)
    email = graphene.String(required=False)
    password = graphene.String(required=False)
    download = graphene.String(required=False)
    note = graphene.String(required=False)

class UpdateOrderStatusInput(graphene.InputObjectType):
        status = graphene.String(required=True)
        orderId = graphene.ID(required=True)
        productAccesses = graphene.List(graphene.List, required=True)

class UpdateOrderStatus(graphene.Mutation):
    class Arguments:
        input = UpdateOrderStatusInput(required=True)
    
    def mutate(self, info, input):
        
        pass
    # Order  COMPLETED
    # 1, Check Payment Status
    # 2, Create ProductAccess
    # 3, Update Payment Status
    # Order CANCELLED
    # 1, Check : If payment is not  COMPLETED
    # 2, if ProductAccess then delete
    # 4, Update Order Status


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
            form.save()
            return PaymentCUD( success=True)
        
        raise create_graphql_error(form.errors)
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
    

class DeleteReview(graphene.Mutation):
    message = graphene.String()
    success = graphene.Boolean()    
    class Arguments:
        id = graphene.ID(required=True)

    @isAuthenticated()
    def mutate(self, info, id):
        review = get_object_by_kwargs(Review, {"id": id})
        review.delete()
        return DeleteReview(success=True, message="Deleted!")

class DeleteAttribute(graphene.Mutation):
    message = graphene.String()
    success = graphene.Boolean()    
    class Arguments:
        id = graphene.ID(required=True)
    @isAuthenticated([UserRole.ADMIN])
    def mutate(self, info, id):
        attribute = get_object_by_kwargs(Attribute, {"id": id})
        attribute.delete()
        return DeleteAttribute(success=True, message="Deleted!")
    
class DeleteDescription(graphene.Mutation):
    message = graphene.String()
    success = graphene.Boolean()    
    class Arguments:
        id = graphene.ID(required=True)

    @isAuthenticated([UserRole.ADMIN])
    def mutate(self, info, id):
        description = get_object_by_kwargs(ProductDescription, {"id": id})
        description.delete()
        return DeleteDescription(success=True, message="Deleted!")



# Access Credential 
class OrderProductCredentialAccess(graphene.Mutation):
    success = graphene.Boolean()
    access = graphene.Field(ProductAccessType)

    class Arguments:
        orderProductId = graphene.ID()

    @isAuthenticated()
    def mutate(self, info, orderProductId):
        # check order is valid
        orderProduct = get_object_by_kwargs(OrderProduct, {"id": orderProductId})
        if not orderProduct:
            raise GraphQLError("Order not found")
        # check order is valid
        if orderProduct.order.status != "COMPLETED":
            raise GraphQLError("Order is not completed")
        # check order is valid
     
        if orderProduct.order.user != info.context.User:
            raise GraphQLError("Order is not valid")
       
        productAccess = ProductAccess.objects.filter(item=orderProduct).first()

        if not productAccess:
            raise GraphQLError("Product access not found")
        

        # if is there cookies in product access then can access
        if not productAccess.credential.cookies:
            raise GraphQLError("Product access not found")
        
        # check cookies is expired
        if productAccess.expired_date:
            if productAccess.expired_date <= timezone.now():
                productAccess.is_expired = True
                productAccess.save()

                raise GraphQLError("Product access cookies is expired")
        
        # check access time is valid
        if productAccess.access_count:
            if productAccess.access_limit <= productAccess.access_count:

                productAccess.is_expired = True
                productAccess.save()

                raise GraphQLError("Product access time is expired")


        return OrderProductCredentialAccess(
            access=productAccess,
            success =True,
        )






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
    product_attribute_and_opton_cud = ProductAttributeAndOptonCUD.Field()
    delete_attribute = DeleteAttribute.Field()
    delete_description = DeleteDescription.Field()
    order_product_credential_access = OrderProductCredentialAccess.Field()
    product_access_cud = ProductAccessCUD.Field()



