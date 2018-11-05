from django.http import HttpResponse
from django.shortcuts import render

from orders.models import Size, PizzaType, PizzaTopping, Pizza, SubExtra, Sub, Pasta, Salad, Platter

# Create your views here.
def index(request):
    context = {
        "pizzas": Pizza.objects.all(),
        "toppings": PizzaTopping.objects.all(),
        "subs": Sub.objects.all(),
        "subextras": SubExtra.objects.all(),
        "pastas": Pasta.objects.all(),
        "salads": Salad.objects.all(),
        "platters": Platter.objects.all()
    }
    return render(request, "orders/index.html", context)
    #return HttpResponse("Project 3: TODO")
