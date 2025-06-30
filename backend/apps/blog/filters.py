# backend/apps/blog/filters.py
import django_filters
from django.db.models import Q
from apps.base.filters import BaseFilterOrderBy
from .models import BlogCategory, BlogPost

class BlogPostFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method='filter_search', label="Search")
    category = django_filters.CharFilter(field_name='category__slug', lookup_expr='exact', label="Category Slug")

    class Meta:
        model = BlogPost
        fields = ['search', 'category', 'is_published']

    def filter_search(self, queryset, name, value):
        return queryset.filter(
            Q(title__icontains=value) |
            Q(content__icontains=value)
        )
    
class BlogCategoryFilter(BaseFilterOrderBy):
    class Meta:
        model = BlogCategory
        fields = '__all__'