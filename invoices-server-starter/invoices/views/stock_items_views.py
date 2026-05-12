from rest_framework import viewsets, status

from ..serializers import StockItemsSerializer
from ..models import StockItem

class StockItemsViewSet(viewsets.ModelViewSet):
    serializer_class = StockItemsSerializer
    queryset = StockItem.objects.all()
