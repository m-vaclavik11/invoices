from django.urls import path, include
from .routers import SlashOptionalRouter

from .views.invoice_views import InvoiceViewSet
from .views.person_views import PersonViewSet
from .views.stock_items_views import StockItemsViewSet

router = SlashOptionalRouter()
router.register(r'persons', PersonViewSet)
router.register(r'invoices', InvoiceViewSet)
router.register(r'stockitems', StockItemsViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/identification/<str:ico>/sales', InvoiceViewSet.as_view({'get': 'get_invoices'}), name='salled'),
    path('api/identification/<str:ico>/purchases', InvoiceViewSet.as_view({'get': 'get_invoices'}), name='purchased'),
]


