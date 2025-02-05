from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IndexDataViewSet, ForexDataViewSet, IndexHistoryView, ForexHistoryView
from . import views

router = DefaultRouter()
router.register(r'indices', IndexDataViewSet, basename='indexdata')
router.register(r'forex', ForexDataViewSet, basename='forexdata')

urlpatterns = [
    path('', include(router.urls)),
    path('add_index_ticker/', views.add_index_ticker, name='add_index_ticker'),
    path('add_forex_pair/', views.add_forex_pair, name='add_forex_pair'),
    path("indices/<str:ticker>/history/", IndexHistoryView.as_view(), name="index-history"),
    path("forex/<str:pair>/history/", ForexHistoryView.as_view(), name="forex-history"),
]
