from django import forms
from .models import OrderProductAttribute, FAQ, Review, Product, Category,ProductDescription,Attribute,AttributeOption,ProductAccess,  Order, OrderProduct, User,   Payment

class OrderProductAttributeForm(forms.ModelForm):
    id = forms.CharField(required=False)
    class Meta:
        model = OrderProductAttribute
        fields = "__all__"

class ReviewForm(forms.ModelForm):
    id = forms.CharField(required=False)
    class Meta:
        model = Review
        fields = "__all__"


class ReviewForm(forms.ModelForm):
    id = forms.CharField(required=False)
    class Meta:
        model = Review
        fields = "__all__"


class FAQForm(forms.ModelForm):
    id = forms.CharField(required=False)
    class Meta:
        model = FAQ
        fields = "__all__"

class ProductForm(forms.ModelForm):
    id = forms.CharField(required=False)
    class Meta:
        model = Product
        fields = "__all__"

class CredentialForm(forms.ModelForm):
    id = forms.CharField(required=False)
    class Meta:
        model = ProductAccess
        fields = "__all__"

class AttributeOptionForm(forms.ModelForm):
    id = forms.CharField(required=False)
    class Meta:
        model = AttributeOption
        fields = "__all__"

class ProductDescriptionForm(forms.ModelForm):
    id = forms.CharField(required=False)
    class Meta:
        model = ProductDescription
        fields = "__all__"


class AttributeForm(forms.ModelForm):
    id = forms.CharField(required=False)
    class Meta:
        model = Attribute
        fields = "__all__"
        
  

class CategoryForm(forms.ModelForm):
    id = forms.CharField(required=False)
    class Meta:
        model = Category
        fields = '__all__'
        

class OrderForm(forms.ModelForm):
    id = forms.CharField(required=False)
    table_bookings = forms.CharField(required=False)
    class Meta:
        model = Order
        fields = '__all__'

class OrderProductForm(forms.ModelForm):
    id = forms.CharField(required=False)
    class Meta:
        model = OrderProduct
        fields = '__all__'


class PaymentForm(forms.ModelForm):
    id = forms.CharField(required=False)
    class Meta:
        model = Payment
        fields = '__all__'       
        

      