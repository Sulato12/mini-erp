from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from sales.views import PartnerViewSet, ProductViewSet, SaleOrderViewSet
from rest_framework.authtoken.views import obtain_auth_token

router = DefaultRouter()
router.register("partners", PartnerViewSet)
router.register("products", ProductViewSet)
router.register("orders", SaleOrderViewSet)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path("api/login/", obtain_auth_token),
]