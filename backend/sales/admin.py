from django.contrib import admin
from .models import Partner, Product, SaleOrder, SaleOrderLine, StockMove


admin.site.register(Partner)
admin.site.register(StockMove)

class SaleOrderLineInline(admin.TabularInline):
    model = SaleOrderLine
    extra = 1

@admin.register(SaleOrder)
class SaleOrderAdmin(admin.ModelAdmin):
    list_display = ("id", "partner", "status", "total")
    list_filter = ("status",)
    inlines = [SaleOrderLineInline]

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("reference", "name", "price", "stock_display")
    search_fields = ("reference", "name")

    def get_queryset(self, request):
        return super().get_queryset(request).with_stock()

    @admin.display(description="Stock")
    def stock_display(self, obj):
        return obj.stock