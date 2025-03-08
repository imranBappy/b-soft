from django import forms
from apps.core.models import Slider, StaticPage, WebsiteInfo, ContactUs



class SliderForm(forms.ModelForm):
    id = forms.CharField(required=False)
    class Meta:
        model = Slider
        fields = '__all__'   

class StaticPageForm(forms.ModelForm):
    id = forms.CharField(required=False)
    class Meta:
        model = StaticPage
        fields = '__all__'   

class WebsiteInfoForm(forms.ModelForm):
    id = forms.CharField(required=False)
    class Meta:
        model = WebsiteInfo
        fields = '__all__'   

class ContactUsForm(forms.ModelForm):
    id = forms.CharField(required=False)
    class Meta:
        model = ContactUs
        fields = '__all__'   