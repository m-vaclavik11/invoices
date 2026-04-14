from django.urls import path, include
from .routers import SlashOptionalRouter
from .views.invoice_views import InvoiceViewSet

from .views.person_views import PersonViewSet

router = SlashOptionalRouter()
router.register(r'persons', PersonViewSet)
router.register(r'invoices', InvoiceViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/identification/<str:ico>/sales', InvoiceViewSet.as_view({'get': 'get_invoices'}), name='salled'),
    path('api/identification/<str:ico>/purchases', InvoiceViewSet.as_view({'get': 'get_invoices'}), name='purchased'),
    #path('api/invoices/statistics', InvoiceViewSet.as_view({'get': 'get_stats'}), name="invoice_statistics"),
    #path('api/persons/statistics', InvoiceViewSet.as_view({'get': 'get_statistics'}) ),
]


