from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from orders.models import Size, PizzaType, PizzaTopping, Pizza, SubExtra, Sub, Pasta, Salad, Platter, Orders

# Create your views here.
def index(request):
    if request.user.is_authenticated:
        context = {
            "user": request.user,
            "pizzas": Pizza.objects.all(),
            "toppings": PizzaTopping.objects.all(),
            "subs": Sub.objects.all(),
            "subextras": SubExtra.objects.all(),
            "pastas": Pasta.objects.all(),
            "salads": Salad.objects.all(),
            "platters": Platter.objects.all()
        }
        return render(request, "orders/index.html", context)      
    else:
        context = {
            "message": None,
        }
        return render(request, "orders/login.html", context) 
        #return HttpResponse("Project 3: TODO")

def login_view(request):
    username = request.POST["username"]
    password = request.POST["password"]
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "orders/login.html", { "message": "Invalid credentials"})

def logout_view(request):
    logout(request)
    return render(request, "orders/login.html", { "message": "Logged out"})

def register_view(request):
    username = request.POST["username"]
    email = request.POST["email"]
    password = request.POST["password"]
    first_name = request.POST["first_name"]
    last_name = request.POST["last_name"]
    user = User.objects.create_user(username, email, password)
    if user is not None:
        user.first_name = first_name
        user.last_name = last_name
        user.save()
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "orders/login.html", { "message": "Invalid signup credentials"})

