from django.urls import path
from .views import all_index_data_view, all_forex_data_view, search_index_data_view, search_forex_data_view

urlpatterns = [
    path('indices/', all_index_data_view, name="all_index_data"),
    path('forex/', all_forex_data_view, name="all_forex_data"),
    path('indices/search/', search_index_data_view, name="search_index_data"),
    path('forex/search/', search_forex_data_view, name="search_forex_data"),
]