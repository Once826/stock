from rest_framework import serializers
from .models import IndexData, ForexData

class IndexDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndexData
        fields = '__all__'

class ForexDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForexData
        fields = '__all__'

class AddIndexTickerSerializer(serializers.Serializer):
    ticker = serializers.CharField(max_length=20)

class AddForexPairSerializer(serializers.Serializer):
    pair = serializers.CharField(max_length=7)