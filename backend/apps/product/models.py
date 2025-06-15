from decimal import Decimal
from django.db import models
from apps.accounts.models import User 
from datetime import timezone
from decouple import config
from apps.base.mail import send_mail_from_template
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    image = models.URLField(default="", blank=True)
    description = models.TextField(default="", blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.id} - {self.name}"

class Product(models.Model):
    TAGS_CHOOSE = [
        ("TOP_RATED", "Top Rated"),
        ("RECOMMENDED", "Recommended"),
        ("NEWLY_LAUNCHED", "Newly Launched"),
        ("DAILY_SPECIAL", "Daily Special"),
        ("HOT", "Hot"),
        ("TRENDING", "Trending"),
        ("BEST_SELLER", "Best Seller"),
        ("POPULAR", "Popular"),
        ("FEATURED", "Featured")
    ]
    slug = models.SlugField(max_length=255, blank=True, null=True, unique=True)  # no unique=True yet

    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=12, decimal_places=8)
    price_range = models.CharField(max_length=100, null=True, blank=True)
    offer_price =models.DecimalField(max_digits=12, decimal_places=8, null=True, blank=True)
    short_description = models.TextField(null=True, blank=True)
    
    photo =  models.CharField(max_length=1000, null=True, blank=True)
    tag = models.CharField(max_length=50, choices=TAGS_CHOOSE,
        null=True, blank=True
    )
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="products"
    )
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.id} - {self.name}"
    
    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.pk:
            super().save(*args, **kwargs)  # First save to get the ID
            base_slug = slugify(self.name.lower())
            self.slug = f"{base_slug}-{self.pk}"
            Product.objects.filter(pk=self.pk).update(slug=self.slug)
        else:
            super().save(*args, **kwargs)


class ProductDescription(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='descriptions')
    label = models.CharField(max_length=300)
    tag = models.CharField(max_length=300)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.id} - {self.label}"

class  Attribute(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='attributes')
    name = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.id} - {self.name}"
    
class  AttributeOption(models.Model):
    attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE, related_name='attribute_options')
    option = models.CharField(max_length=100) # 
    message = models.TextField(blank=True, null=True)  # Optional message for specific option
    extra_price = models.DecimalField(max_digits=12, decimal_places=8)
    photo =  models.CharField(max_length=255,null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.id} - {self.option}"
    

class Credential(models.Model):
    name = models.CharField(max_length=255,)
    download = models.CharField(max_length=255, null=True, blank= True)
    cookies = models.TextField(null=True, blank= True)         # cookies for the product
    access_limit = models.IntegerField(default=0)              
    note = models.CharField(max_length=255, null=True, blank= True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    access_count = models.IntegerField(default=0, null=True, blank= True) 

    def __str__(self):
        return f"{self.id}"

    
ORDER_STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("COMPLETED", "Completed"),
        ("CANCELLED", "Cancelled")
    ]

PAYMENT_METHOD_CHOICES = [
        ("BKASH", "Bkash"),
        ("NAGAD", "Nagad"),
        ('ROCKET', 'Rocket')
    ]
     

class InvalidCouponError(Exception):
    pass   
class Coupon(models.Model):
    code = models.CharField(max_length=50, unique=True)
    DISCOUNT_TYPE_CHOOSE = [
        ('Flat', 'Flat'),
        ('Percentage', 'Percentage'),
    ]
    discount_type = models.CharField(max_length=50, choices=DISCOUNT_TYPE_CHOOSE)
    discount_value = models.DecimalField(max_digits=12, decimal_places=8) # percentage or amount
    
    max_discount = models.DecimalField(max_digits=12, decimal_places=8, null=True, blank=True)  # The maximum amount a discount can provide when the coupon type is "Percentage."
    min_order_value = models.DecimalField(max_digits=12, decimal_places=8,  null=True, blank=True) # The minimum order amount required for the coupon to be valid.
    
    valid_from = models.DateTimeField()
    valid_until  = models.DateTimeField()
    usage_limit = models.IntegerField(default=0)
    times_used = models.IntegerField(default=0) # It increase by 1 one every time when it will used
    
    per_user_limit = models.IntegerField(default=0) # '0' No limit on the number of times a user can use it.
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def is_valid(self, amount, userId):
            
        # time validation
        if self.valid_from < timezone.now() or timezone.now() > self.valid_until:
            raise InvalidCouponError("Invalid coupon.")
        
        #  min_order_value validation
        if self.min_order_value and  (self.min_order_value > amount):
            raise InvalidCouponError(f"You have to buy minmum {self.min_order_value} of product")
        
        # usage_limit validation
        if self.usage_limit and  self.times_used >= self.usage_limit:
            raise InvalidCouponError("Invalid coupon.")
        
        if self.per_user_limit:
            order_count = Order.objects.filter(user=userId, coupon=self).count()
            if order_count >= self.per_user_limit:
                raise InvalidCouponError("Coupon usage limit exceeded for this user.")
        
        return 0
            
    
    def discount_amount(self, amount):
        if self.discount_type == self.DISCOUNT_TYPE_CHOOSE[0][0]:
            discount = self.discount_value
            return max(amount - discount, 0)
        elif  self.discount_type == self.DISCOUNT_TYPE_CHOOSE[1][0]:
            discount = (amount * self.discount_value) / 100
            if self.max_discount:
                discount = min(discount, self.max_discount)
            return max(amount - discount, 0)
        return amount
                
    def apply(self):
        # self.times_used = F('times_used') + 1
        self.save(update_fields=['times_used'])           
    
    def __str__(self):
        return f"{self.id} - {self.code}"
   
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders")
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=100, choices=ORDER_STATUS_CHOICES)
    order_id = models.CharField(max_length=100, unique=True, blank=True, null=True)
    is_cart = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def send_email(self):

        def serialize_order(self):
            """Convert Order and related objects to a JSON-serializable dictionary."""
            items = []
            for item in self.items.all():
                # Calculate variant extra price
                variant_extra_price = sum(
                    Decimal(str(attr.extra_price)) 
                    for attr in item.order_product_attribute.all()
                )
                item_dict = {
                    'id': str(item.id),
                    'product': {
                        'name': item.product.name,
                        'image': item.product.photo,
                    },
                    'quantity': item.quantity,
                    'price': float(item.price),  # Convert Decimal to float for JSON
                    'variant_extra_price': float(variant_extra_price),
                    'total_price': float((item.price + variant_extra_price) * item.quantity),
                    'order_product_attribute': [
                        {
                            'attribute': attr.attribute.name,
                            'option': attr.option.option,
                            'extra_price': float(attr.extra_price)
                        } for attr in item.order_product_attribute.all()
                    ],
                    'access':    {
                        'note': item.access.note if item.access else None,
                        'email': item.access.email if item.access else None,
                        'username': item.access.username if item.access else None,
                        'password': item.access.password if item.access else None,
                        'download': item.access.download if item.access else None,
                    } if self.status == "CONFIRMED" else None
                }
                items.append(item_dict)

            return {
                'order_id': self.order_id,
                'created_at': self.created_at.isoformat(),  # Convert datetime to string
                'status': self.status,
                'total_price': float(self.total_price),
                'items': items,
            }
        order_data = serialize_order(self)
        # Email context
        context = {
            'company_name': 'Bsoft',
            'logo_url': config("LOGO_URL", None),
            'support_email': 'support@b-soft.xyz',
            'order': order_data
        }
        print(context)
        # Email subject
        subject = f'Order Confirmation #{self.order_id}'
        template = 'order_confirmation.html'
        # Use Celery task for sending email
        send_mail_from_template(
            template,
            context,
            subject,
            self.user.email if self.user else 'default@example.com'  # Fallback email if user is None
        )

    
    def __str__(self):
        return f"{self.id}"
    
    class Meta:
        ordering = ['-id']
    
    # def save(self, *args, **kwargs):
    #     if self.coupon:
    #         if self.coupon.is_valid(self.amount, self.user.id):
    #             discount = self.coupon.discount_amount(self.amount)
    #             self.discount_applied = self.amount - discount
    #             self.final_amount = self.final_amount - (self.amount - discount)
    #         else:
    #             raise ValueError("Invalid coupon.")
    #         self.coupon.apply()
        
    #     super().save(*args, **kwargs)

class OrderProduct(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name="orders")
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, blank=True, related_name='items') 

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)    

 
    def __str__(self):
        return f"{self.id} - {self.product.name} - {self.quantity}"
    

class ProductAccess(models.Model):

    prodduct = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True, blank=True, related_name='access')
    attributeOption = models.ForeignKey(AttributeOption, on_delete=models.SET_NULL, null=True, blank=True, related_name='access')

    item = models.OneToOneField(OrderProduct, on_delete=models.SET_NULL, null=True, blank=True, related_name='access')
    username = models.CharField(max_length=255, null=True, blank= True)
    email = models.EmailField(max_length=255, null=True, blank= True)
    password = models.CharField(max_length=255, null=True, blank= True)
    download = models.CharField(max_length=255, null=True, blank= True)

    cookies = models.TextField(null=True, blank= True)
    expired_date = models.DateTimeField(null=True, blank= True) # when the access will be expired
    access_count = models.IntegerField(default=0)              # how many times the access will be used
    access_limit = models.IntegerField(default=0)  # how many device 
    is_expired = models.BooleanField(default=False)
    
    note = models.TextField(max_length=255, null=True, blank= True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.id}"
    
    class Meta:
        ordering = ['-created_at']



  
class OrderProductAttribute(models.Model):
    attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE, related_name='order_product_attribute')
    option = models.ForeignKey(AttributeOption, on_delete=models.CASCADE, related_name='order_product_attribute')
    order_product = models.ForeignKey(OrderProduct, on_delete=models.CASCADE, related_name='order_product_attribute')
    extra_price = models.DecimalField(max_digits=12, decimal_places=8)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 

    def __str__(self):
        return f"{self.id} "

class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("COMPLETED", "Completed"),
        ("FAILED", "Failed"),
        ("REFUNDED", "Refunded"),
    ]
  
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, related_name='payments', null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(
        max_length=100, 
        choices=PAYMENT_METHOD_CHOICES
    )
    account_number= models.CharField(
        max_length=15, 
        null=True, 
        blank=True
    )
    status = models.CharField(
        max_length=100, 
        choices=PAYMENT_STATUS_CHOICES, 
        default="PENDING"
    )
    trx_id = models.CharField(
        max_length=100, 
        unique=True, 
        null=True, 
        blank=True
    )
    remark = models.TextField(
        null=True, 
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

   
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Payment {self.id} - Order {self.order.id} - Status {self.status}"

class FAQ(models.Model):
    question = models.CharField(max_length=255)
    answer = models.TextField()
    product = models.ForeignKey('Product', related_name='faqs', on_delete=models.CASCADE)

    def __str__(self):
        return self.question

class Review(models.Model):
    product = models.ForeignKey(Product, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='reviews', on_delete=models.CASCADE)

    content = models.TextField()
    rating = models.PositiveSmallIntegerField(default=1)  # Rating from 1 to 5
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.rating} Stars"
    
    class Meta:
        ordering = ['-created_at']



class Software(models.Model):
    name = models.CharField(max_length=255)
    buy_link = models.URLField()
    tutorial_link = models.URLField(blank=True, null=True)
    official_site = models.URLField(blank=True, null=True)
    download_link = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name
