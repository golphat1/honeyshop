from django.urls import path
from .views import (
    ProductViewSet,
    get_cart,
    add_to_cart,
    create_checkout_session,
    get_orders,
)
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"products", ProductViewSet, basename="product")

urlpatterns = [
    path("cart/", get_cart),
    path("cart/add/", add_to_cart),
    path("checkout/", create_checkout_session),
    path("orders/", get_orders),
]

urlpatterns += router.urls
