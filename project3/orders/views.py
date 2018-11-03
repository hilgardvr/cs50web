from django.http import HttpResponse
from django.shortcuts import render

# Create your views here.
def index(request):
    context = {
        "pizzas": ["Sciciliana", "Hawaian"]
    }
    return render(request, "orders/index.html", context)
    #return HttpResponse("Project 3: TODO")
