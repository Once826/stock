import django_filters
from .models import IndexData, ForexData

class IndexDataFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="close", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="close", lookup_expr='lte')
    date = django_filters.DateFilter(field_name="date")
    date_after = django_filters.DateFilter(field_name="date", lookup_expr='gte')
    date_before = django_filters.DateFilter(field_name="date", lookup_expr='lte')

    class Meta:
        model = IndexData
        fields = ['ticker', 'date', 'min_price', 'max_price', 'date_after', 'date_before']

class ForexDataFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="close", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="close", lookup_expr='lte')
    date = django_filters.DateFilter(field_name="date")
    date_after = django_filters.DateFilter(field_name="date", lookup_expr='gte')
    date_before = django_filters.DateFilter(field_name="date", lookup_expr='lte')

    class Meta:
        model = ForexData
        fields = ['pair', 'date', 'min_price', 'max_price', 'date_after', 'date_before']
