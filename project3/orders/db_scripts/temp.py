#exec(open('orders/temp.py').read())
from orders.models import Size, PizzaType, PizzaTopping, Pizza, SubExtra, Sub, Pasta, Salad, Platter

small = Size.objects.get(pk=1)
large = Size.objects.get(pk=2)
regular = PizzaType.objects.get(pk=1)
sicilian = PizzaType.objects.get(pk=2)