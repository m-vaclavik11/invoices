from rest_framework import viewsets, status
from rest_framework.response import Response

from ..models import Invoice
from ..serializers import InvoiceSerializer
from ..services.invoice_service import InvoiceService

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    def get_invoices(self, request, ico=None):
        """
        description: Získá seznam faktur vystavených nebo přijatých konkrétní osobou. Konkrétní osoba je zde reprezentována číslem IČO
        (identificationNumber)
        return: Serializovaná data v podobě seznamu faktur
        """
        if "/sales" in request.path:
            invoices = (Invoice.objects.select_related("seller").filter(seller__identificationNumber=ico))
        else:
            invoices = (Invoice.objects.select_related("buyer").filter(buyer__identificationNumber=ico))
        serializer = self.get_serializer(invoices, many=True)
        # použije příslušný serializér
        # many=True znamená, že se bude serializovat ne jen jeden objekt, ale seznam objektů
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        buyer_id = request.GET.get('buyerID')
        seller_id = request.GET.get('sellerID')
        product = request.GET.get('product')
        min_price = request.GET.get('minPrice')
        max_price = request.GET.get('maxPrice')
        limit = request.GET.get('limit')

        try:
            queryset = InvoiceService.get_filtered_queryset(
                buyer_id=buyer_id, seller_id=seller_id, product=product, min_price=min_price, max_price=max_price, limit=limit)
        except ValueError as e:
            return  Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



