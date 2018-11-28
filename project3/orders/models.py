from django.db import models
from django.contrib.auth.models import User

class Size(models.Model):
    code = models.CharField(max_length=7)
    size = models.CharField(max_length=63)

    def __str__(self):
        return f"{self.size}"

class PizzaType(models.Model):
    pizzaType = models.CharField(max_length=63)

    def __str__(self):
        return f"{self.pizzaType}"

class PizzaTopping(models.Model):
    topping = models.CharField(max_length=63)

    def __str__(self):
        return f"{self.topping}"

class Pizza(models.Model):
    pizza = models.CharField(max_length=63)
    pizzaType = models.ForeignKey(PizzaType, on_delete=models.CASCADE, related_name="pizza_type")
    size = models.ForeignKey(Size, on_delete=models.CASCADE, related_name="pizza_size")
    price = models.FloatField(default=0)
    pizzaToppings = models.ManyToManyField(PizzaTopping, blank=True, related_name="pizza_toppings")

    def __str__(self):
        return f"\n{self.pizzaType} {self.size} {self.pizza} - Price: ${self.price}"

class SubExtra(models.Model):
    subExtra = models.CharField(max_length=63)
    price = models.FloatField(default=0)

    def __str__(self):
        return f"{self.subExtra} - Price: ${self.price}"

class Sub(models.Model):
    sub = models.CharField(max_length=63)
    size = models.ForeignKey(Size, on_delete=models.CASCADE, related_name="sub_size")
    price = models.FloatField(default=0)
    subExtra = models.ManyToManyField(SubExtra, blank=True, related_name="sub_extra")

    def __str__(self):
        return f"{self.sub} - Price: ${self.price}"

class Pasta(models.Model):
    pasta = models.CharField(max_length=63)
    price = models.FloatField(default=0)

    def __str__(self):
        return f"{self.pasta} - Price: ${self.price}"

class Salad(models.Model):
    salad = models.CharField(max_length=63)
    price = models.FloatField(default=0)

    def __str__(self):
        return f"{self.salad} - Price: ${self.price}"

class Platter(models.Model):
    platter = models.CharField(max_length=63)
    size = models.ForeignKey(Size, on_delete=models.CASCADE, related_name="platter_size")
    price = models.FloatField(default=0)

    def __str__(self):
        return f"{self.platter} - Price: ${self.price}"

class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    pizza = models.ManyToManyField(Pizza, blank=True, related_name="order_pizza")
    sub = models.ManyToManyField(Sub, blank=True, related_name="order_sub")
    salad = models.ManyToManyField(Salad, blank=True, related_name="order_salad")
    platter = models.ManyToManyField(Platter, blank=True, related_name="order_platter")
    checkedout = models.BooleanField(default=False)

# Create your models here.
