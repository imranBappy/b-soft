from apps.core.models import Slider, WebsiteInfo, StaticPage
from apps.base.filters import BaseFilterOrderBy

 


class SliderFilter(BaseFilterOrderBy):
    class Meta:
        model = Slider
        fields = '__all__'

class WebsiteInfoFilter(BaseFilterOrderBy):
    class Meta:
        model = WebsiteInfo
        fields = '__all__'

class StaticPageFilter(BaseFilterOrderBy):
    class Meta:
        model = StaticPage
        fields = '__all__'
