from ..models import Invoice

class InvoiceService:
    @staticmethod
    def get_filtered_queryset(buyer_id=None, seller_id=None, product=None, min_price=None, max_price=None, limit=None):
        queryset = Invoice.objects.all()

        if buyer_id:
            queryset = queryset.filter(buyer__identificationNumber=buyer_id)

        if seller_id:
            queryset = queryset.filter(seller__identificationNumber=seller_id)

        if product:
            queryset = queryset.filter(product__icontains=product)

        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        queryset = queryset.select_related('buyer', 'seller')  # Vytvoří JOIN vazbu

        if limit:
            try:
                limit = int(limit)
                queryset = queryset[:limit]
            except ValueError:
                raise ValueError("Limit must be an integer.")

        return queryset