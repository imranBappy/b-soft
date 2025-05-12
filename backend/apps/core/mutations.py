import graphene
from apps.base.utils import get_object_or_none, create_graphql_error
from apps.core.forms import SliderForm , ContactUsForm
from apps.core.models import Slider, ContactUs
from backend.authentication import isAuthenticated
from graphene_django.forms.mutation import DjangoFormMutation
from apps.accounts.models import  UserRole


class SliderCUD(DjangoFormMutation):
    message = graphene.String()
    success = graphene.Boolean()
    
    class Meta:
        form_class = SliderForm
    
    @isAuthenticated([UserRole.ADMIN, UserRole.MANAGER])
    def mutate_and_get_payload(self, info, **input):
        instance = get_object_or_none(Slider, id=input.get('id'))
        form = SliderForm(input, instance=instance)

        if form.is_valid():
            form.save()
            return SliderCUD(
                message="Created successfully",
                success=True,
            )
        
        create_graphql_error(form)

class ContactUsCUD(DjangoFormMutation):
    message = graphene.String()
    success = graphene.Boolean()
    
    class Meta:
        form_class = ContactUsForm
    

    def mutate_and_get_payload(self, info, **input):
        instance = get_object_or_none(ContactUs, id=input.get('id'))
        form = ContactUsForm(input, instance=instance)

        if not form.is_valid():
            return create_graphql_error(form)
        
        form.save()
        return ContactUsCUD(
                message="Created successfully",
                success=True,
        )
        

class Mutation(graphene.ObjectType):
    slider_cud = SliderCUD.Field()
    contact_us_cud= ContactUsCUD.Field()
   
  
    