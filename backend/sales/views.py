from django.shortcuts import render
from rest_framework import viewsets, status as http_status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product, Partner, SaleOrder
from .serializers import ProductSerializer, PartnerSerializer, SaleOrderSerializer
from .services import confirm_order, cancel_order, OrderError


class PartnerViewSet(viewsets.ModelViewSet):
    queryset = Partner.objects.all()
    serializer_class = PartnerSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.with_stock()
    serializer_class = ProductSerializer


class SaleOrderViewSet(viewsets.ModelViewSet):
    queryset = SaleOrder.objects.all()
    serializer_class = SaleOrderSerializer

class SaleOrderViewSet(viewsets.ModelViewSet):
    queryset = SaleOrder.objects.all()
    serializer_class = SaleOrderSerializer

    @action(detail=True, methods=["post"])
    def confirm(self, request, pk=None):
        order = self.get_object()
        try:
            confirm_order(order)
        except OrderError as e:
            return Response({"detail": str(e)}, status=http_status.HTTP_409_CONFLICT)
        return Response(SaleOrderSerializer(order).data)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        order = self.get_object()
        try:
            cancel_order(order)
        except OrderError as e:
            return Response({"detail": str(e)}, status=http_status.HTTP_409_CONFLICT)
        return Response(SaleOrderSerializer(order).data)