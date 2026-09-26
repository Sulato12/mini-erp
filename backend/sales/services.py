from django.db import transaction
from .models import SaleOrder, StockMove, Product


class OrderError(Exception):
    pass


def confirm_order(order):
    if order.status != SaleOrder.Status.DRAFT:
        raise OrderError("Seule une commande en brouillon peut être confirmée.")

    with transaction.atomic():
        for line in order.lines.all():
            product = Product.objects.with_stock().get(pk=line.product_id)
            if product.stock < line.quantity :
                raise OrderError(f"Stock insuffisant pour {product.name}")

        for line in order.lines.all():
            StockMove.objects.create(
                product = line.product,
                quantity = -line.quantity,
                move_type = StockMove.MoveType.OUT,
                order = order,
            )

        order.status = SaleOrder.Status.CONFIRMED
        order.save()

    return order

def cancel_order(order):
    if order.status != SaleOrder.Status.CONFIRMED:
        raise OrderError("Seule une commande confirmée peut être annulée.")

    with transaction.atomic():

        for line in order.lines.all():
            StockMove.objects.create(
                product = line.product,
                quantity = line.quantity,
                move_type = StockMove.MoveType.IN,
                order = order,
            )

        order.status = SaleOrder.Status.CANCELED
        order.save()

    return order