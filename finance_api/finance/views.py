from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import IndexData, ForexData

@api_view(['GET'])
def all_index_data_view(request):
    sort_by = request.GET.get("sort_by", "date")
    order = request.GET.get("order", "asc")
    min_price = request.GET.get("min_price", None)
    max_price = request.GET.get("max_price", None)

    if sort_by not in ["date", "open", "high", "low", "close", "volume", "ticker"]:
        sort_by = "date"

    if order == "desc":
        sort_by = f"-{sort_by}"

    data = IndexData.objects.all()

    if min_price:
        data = data.filter(close__gte=min_price)

    if max_price:
        data = data.filter(close__lte=max_price)

    data = data.order_by(sort_by).values()
    return Response(list(data))

@api_view(['GET'])
def all_forex_data_view(request):
    sort_by = request.GET.get("sort_by", "date")
    order = request.GET.get("order", "asc")
    min_price = request.GET.get("min_price", None)
    max_price = request.GET.get("max_price", None)

    if sort_by not in ["date", "open", "high", "low", "close", "volume", "pair"]:
        sort_by = "date"

    if order == "desc":
        sort_by = f"-{sort_by}"

    data = ForexData.objects.all()

    if min_price:
        data = data.filter(close__gte=min_price)

    if max_price:
        data = data.filter(close__lte=max_price)

    data = data.order_by(sort_by).values()
    return Response(list(data))

@api_view(['GET'])
def search_index_data_view(request):
    query = request.GET.get("query", "")
    if query:
        data = IndexData.objects.filter(ticker__icontains=query).values()
    else:
        data = IndexData.objects.all().values()
    return Response(list(data))

@api_view(['GET'])
def search_forex_data_view(request):
    query = request.GET.get("query", "")
    if query:
        data = ForexData.objects.filter(pair__icontains=query).values()
    else:
        data = ForexData.objects.all().values()
    return Response(list(data))