from django.db import models
from django.db.models.functions import Coalesce
from django.db.models import Sum, Value
from decimal import Decimal
from django.utils import timezone

class ProductQuerySet(models.QuerySet):
    def with_stock(self):
        return self.annotate(
            stock=Coalesce(Sum("stock_moves__quantity"), Value(0))
        )

class Product(models.Model):
    reference = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    tva = models.DecimalField(
        max_digits=4, decimal_places=2, default=Decimal("20.00")
    )
    active = models.BooleanField(default=True)
    objects = ProductQuerySet.as_manager()


    def __str__(self):
        return f"[{self.reference}] {self.name}"

class Partner(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name}"

class SaleOrder(models.Model):

    class Status(models.TextChoices):
        DRAFT = "draft", "brouillon"
        CONFIRMED = "confirmed", "confirmé"
        CANCELED = "canceled", "annulé"
        DELIVERED = "delivered", "livré"

    partner = models.ForeignKey(Partner, on_delete=models.PROTECT)
    date = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT, db_index=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal("0.00"))

    def __str__(self):
        return f"{self.partner} {self.date} : {self.total}"

class SaleOrderLine(models.Model):
    order = models.ForeignKey(SaleOrder, on_delete=models.CASCADE, related_name="lines",)
    product = models.ForeignKey(Product, on_delete=models.PROTECT)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=models.Q(quantity__gt=0),
                name="orderline_quantity_positive",
            ),
        ]

    def __str__(self):
        return f"{self.product} * {self.quantity} : {self.unit_price}"

class StockMove(models.Model):
     
    class MoveType(models.TextChoices):
        IN = "in", "entrée"
        OUT = "out", "sortie"
        AJUST = "adjustment", "ajustement"

    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="stock_moves")
    quantity = models.IntegerField()
    move_type = models.CharField(max_length=15, choices=MoveType.choices)
    date = models.DateTimeField(default=timezone.now)
    order = models.ForeignKey(SaleOrder, on_delete=models.PROTECT, null=True, blank=True, related_name="stock_moves",)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=~models.Q(quantity=0),
                name="stockmove_quantity_not_zero",
            ),
        ]
        indexes = [
            models.Index(fields=["date"]),
        ]

    def __str__(self):
        return f"{self.date} : {self.product} * {self.quantity}"
