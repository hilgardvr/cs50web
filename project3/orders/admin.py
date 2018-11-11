from django.contrib import admin

from .models import Size, PizzaType, PizzaTopping, Pizza, SubExtra, Sub, Pasta, Salad, Platter, Order

admin.site.register(Size)
admin.site.register(PizzaType)
admin.site.register(PizzaTopping)
admin.site.register(Pizza)
admin.site.register(SubExtra)
admin.site.register(Sub)
admin.site.register(Pasta)
admin.site.register(Salad)
admin.site.register(Platter)
admin.site.register(Order)
# Register your models here.
