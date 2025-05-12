from datetime import timedelta
from .models import User, Address
import django_filters as filters
from apps.base.filters import BaseFilterOrderBy
from django.db.models import Q


class UserFilter(BaseFilterOrderBy):
    
    name = filters.CharFilter(lookup_expr='icontains')
    email = filters.CharFilter(lookup_expr='icontains')
    # role = filters.CharFilter(method='filter_role')
    role = filters.NumberFilter(lookup_expr="exact", field_name="role")
    is_verified = filters.BooleanFilter()
    is_active = filters.BooleanFilter()
    gender = filters.CharFilter(lookup_expr='exact')
    search = filters.CharFilter(method='filter_search')
    created_at_start = filters.DateFilter(method='filter_created_at_range', field_name='start')
    created_at_end = filters.DateFilter(method='filter_created_at_range', field_name='end')
    
    class Meta:
        model = User
        fields = [
            'name', 'email', 'gender', 'date_of_birth', 'created_at',
            'photo', 'role', 'phone', 'is_verified', 'term_and_condition_accepted',
            'privacy_policy_accepted', 'privacy_policy_accepted', 'is_active',
        ]  
    
    
    def filter_search(self, queryset, name, value):
        return queryset.filter(Q(name__icontains=value) | Q(email__icontains=value) | Q(phone__icontains=value) )
    
    def filter_created_at_range(self, queryset, name, value):
        if name == 'start':
            return queryset.filter(created_at__gte=value)
        if name == 'end':
            return queryset.filter(created_at__lte=value + timedelta(days=1))
        return queryset


class AddressFilter(BaseFilterOrderBy):
    class Meta:
        model = Address
        fields = '__all__'