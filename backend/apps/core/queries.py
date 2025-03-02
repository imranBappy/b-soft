import graphene
from apps.base.utils import get_object_by_kwargs
from apps.core.objectType import SliderType, StaticPageType, WebsiteInfoType
from apps.core.models import Slider, WebsiteInfo, StaticPage

from apps.product.objectType import  ReviewType
from graphene_django.filter import DjangoFilterConnectionField


class Query(graphene.ObjectType):

    slider = graphene.Field(SliderType, id=graphene.ID(required=True))
    sliders = DjangoFilterConnectionField(SliderType)

    websiteinfo = graphene.Field(WebsiteInfoType, id=graphene.ID(required=True))
    websiteinfos = DjangoFilterConnectionField(WebsiteInfoType)

    staticpage = graphene.Field(StaticPageType, id=graphene.ID(required=True))
    staticpages = DjangoFilterConnectionField(StaticPageType)

    def resolve_slider(self, info, id):
        return get_object_by_kwargs(Slider, {"id": id})
    def resolve_sliders(self, info, **kwargs):
        return Slider.objects.all()


    def resolve_websiteinfo(self, info, id):
        return get_object_by_kwargs(WebsiteInfo, {"id": id})
    def resolve_websiteinfos(self, info, **kwargs):
        return WebsiteInfo.objects.all()
    
    def resolve_staticpage(self, info, id):
        return get_object_by_kwargs(StaticPage, {"id": id})
    def resolve_staticpages(self, info, **kwargs):
        return StaticPage.objects.all()