from rest_framework import serializers
from .models import Product, SaleOrder, SaleOrderLine, Partner
from decimal import Decimal

class ProductSerializer(serializers.ModelSerializer):
    stock = serializers.IntegerField(read_only=True)
    class Meta:
        model = Product
        fields = ["id", "reference", "name", "price", "tva", "active", "stock"]

class SaleOrderLineSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleOrderLine
        fields = ["id", "product", "quantity", "unit_price"]

class SaleOrderSerializer(serializers.ModelSerializer):
    lines = SaleOrderLineSerializer(many=True)
    class Meta:
        model = SaleOrder
        fields = ["id", "partner", "date", "status", "total", "lines"]

    def create(self, validated_data):
        lines_data = validated_data.pop("lines")
        order = SaleOrder.objects.create(**validated_data)
        read_only_fields = ["status", "total"]

        total = Decimal("0.00")
        for line_data in lines_data:
            SaleOrderLine.objects.create(order=order, **line_data)
            total += line_data["unit_price"] * line_data["quantity"]

        order.total = total
        order.save()
        return order

class PartnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Partner
        fields = ["id", "name", "email", "phone", "address"]