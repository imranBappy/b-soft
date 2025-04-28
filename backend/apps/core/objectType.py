from graphene_django.types import DjangoObjectType
from apps.core.filters import SliderFilter, StaticPageFilter, WebsiteInfoFilter
from apps.core.models import Slider, StaticPage, WebsiteInfo
from apps.product.models import OrderProductAttribute
from apps.product.filters import OrderProductAttributeFilter
from backend.count_connection import CountConnection
import graphene

class OrderProductAttributeType(DjangoObjectType):
    id = graphene.ID(required=True)
    class Meta:
        model = OrderProductAttribute
        filterset_class =OrderProductAttributeFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection 

class SliderType(DjangoObjectType):
    id = graphene.ID(required=True)

    class Meta:
        model = Slider
        filterset_class = SliderFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection 

class WebsiteInfoType(DjangoObjectType):
    id = graphene.ID(required=True)

    class Meta:
        model = WebsiteInfo
        filterset_class = WebsiteInfoFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection 

class StaticPageType(DjangoObjectType):
    id = graphene.ID(required=True)

    class Meta:
        model = StaticPage
        filterset_class = StaticPageFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection 