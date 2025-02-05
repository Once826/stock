from django.db.models import Subquery, Max
from django.utils.dateparse import parse_date
from rest_framework import viewsets, filters
from rest_framework.decorators import api_view
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import IndexData, ForexData
from .serializers import IndexDataSerializer, ForexDataSerializer, AddIndexTickerSerializer, AddForexPairSerializer
from .filters import IndexDataFilter, ForexDataFilter
import yfinance as yf

class IndexDataViewSet(viewsets.ModelViewSet):
    queryset = IndexData.objects.all()
    serializer_class = IndexDataSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = IndexDataFilter
    # Enable sorting by multiple fields
    ordering_fields = ['ticker', 'date', 'open', 'high', 'low', 'close', 'volume']
    search_fields = ['ticker']

    def get_queryset(self):
        queryset = super().get_queryset()

        latest_subquery = queryset.values("ticker" if hasattr(queryset.model, "ticker") else "pair").annotate(
            latest_date=Max("date")
        ).values("latest_date")

        queryset = queryset.filter(date__in=Subquery(latest_subquery))

        # Apply ordering if present in query params
        ordering = self.request.query_params.get('ordering', None)
        if ordering:
            # Apply dynamic ordering based on the 'ordering' query param
            if ordering.startswith('-'):
                field = ordering[1:]
                queryset = queryset.order_by('-' + field)
            else:
                queryset = queryset.order_by(ordering)

        # Filtering by price range (optional)
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)

        if min_price and max_price:
            queryset = queryset.filter(close__gte=min_price, close__lte=max_price)
        elif min_price:
            queryset = queryset.filter(close__gte=min_price)
        elif max_price:
            queryset = queryset.filter(close__lte=max_price)

        return queryset


class ForexDataViewSet(viewsets.ModelViewSet):
    queryset = ForexData.objects.all()
    serializer_class = ForexDataSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter, filters.SearchFilter]
    filterset_class = ForexDataFilter
    # Enable sorting by multiple fields
    ordering_fields = ['pair', 'date', 'open', 'high', 'low', 'close', 'volume']
    search_fields = ['pair']

    def get_queryset(self):
        queryset = super().get_queryset()

        latest_subquery = queryset.values("ticker" if hasattr(queryset.model, "ticker") else "pair").annotate(
            latest_date=Max("date")
        ).values("latest_date")

        queryset = queryset.filter(date__in=Subquery(latest_subquery))

        # Apply ordering if present in query params
        ordering = self.request.query_params.get('ordering', None)
        if ordering:
            # Apply dynamic ordering based on the 'ordering' query param
            if ordering.startswith('-'):
                field = ordering[1:]
                queryset = queryset.order_by('-' + field)
            else:
                queryset = queryset.order_by(ordering)

        # Filtering by price range (optional)
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)

        if min_price and max_price:
            queryset = queryset.filter(close__gte=min_price, close__lte=max_price)
        elif min_price:
            queryset = queryset.filter(close__gte=min_price)
        elif max_price:
            queryset = queryset.filter(close__lte=max_price)

        return queryset

class IndexHistoryView(ListAPIView):
    serializer_class = IndexDataSerializer

    def get_queryset(self):
        ticker = self.kwargs["ticker"]
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        queryset = IndexData.objects.filter(ticker=ticker).order_by("-date")

        if start_date:
            start_date = parse_date(start_date)
            if start_date:
                queryset = queryset.filter(date__gte=start_date)

        if end_date:
            end_date = parse_date(end_date)
            if end_date:
                queryset = queryset.filter(date__lte=end_date)

        return queryset

class ForexHistoryView(ListAPIView):
    serializer_class = ForexDataSerializer

    def get_queryset(self):
        pair = self.kwargs["pair"]
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)

        queryset = ForexData.objects.filter(pair=pair).order_by("-date")

        if start_date:
            start_date = parse_date(start_date)
            if start_date:
                queryset = queryset.filter(date__gte=start_date)

        if end_date:
            end_date = parse_date(end_date)
            if end_date:
                queryset = queryset.filter(date__lte=end_date)

        return queryset

@api_view(['POST'])
def add_index_ticker(request):
    serializer = AddIndexTickerSerializer(data=request.data)
    if serializer.is_valid():
        ticker = serializer.validated_data['ticker']
        # Fetch data for the ticker
        try:
            stock = yf.Ticker(ticker)
            data = stock.history(period="1d", interval="1d")
            if not data.empty:
                latest_data = data.iloc[-1]
                # Create new IndexData entry
                IndexData.objects.get_or_create(
                    ticker=ticker,
                    date=latest_data.name,
                    defaults={
                        'open': latest_data["Open"],
                        'high': latest_data["High"],
                        'low': latest_data["Low"],
                        'close': latest_data["Close"],
                        'volume': latest_data["Volume"]
                    }
                )
                return Response({"message": "Ticker added successfully."}, status=201)
            else:
                return Response({"error": "No data found for the ticker."}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
    return Response(serializer.errors, status=400)

@api_view(['POST'])
def add_forex_pair(request):
    serializer = AddForexPairSerializer(data=request.data)
    if serializer.is_valid():
        pair = serializer.validated_data['pair']
        # Fetch data for the forex pair
        try:
            forex_ticker = f"{pair}=X"
            stock = yf.Ticker(forex_ticker)
            data = stock.history(period="1d", interval="1d")
            if not data.empty:
                latest_data = data.iloc[-1]
                # Create new ForexData entry
                ForexData.objects.get_or_create(
                    pair=pair,
                    date=latest_data.name,
                    defaults={
                        'open': latest_data["Open"],
                        'high': latest_data["High"],
                        'low': latest_data["Low"],
                        'close': latest_data["Close"],
                        'volume': latest_data["Volume"]
                    }
                )
                return Response({"message": "Forex pair added successfully."}, status=201)
            else:
                return Response({"error": "No data found for the forex pair."}, status=400)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
    return Response(serializer.errors, status=400)