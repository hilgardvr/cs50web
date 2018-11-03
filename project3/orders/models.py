from django.db import models

class Size(models.Model):
    code = models.CharField(max_length=7)
    size = models.CharField(max_length=63)

    def __str__(self):
        return f"{self.size} - {self.code}"

class PizzaType(models.Model):
    pizzaType = models.CharField(max_length=63)

    def __str__(self):
        return f"{self.pizzaType}"

class Topping(models.Model):
    topping = models.CharField(max_length=63) 

    def __str__(self):
        return f"{self.topping}"

class Pizza(models.Model):
    pizza = models.CharField(max_length=63)
    pizzaType = models.ForeignKey(PizzaType, on_delete=models.CASCADE, related_name="pizza_type")
    size = models.ForeignKey(Size, on_delete=models.CASCADE, related_name="pizza_size")
    pizzaToppings = models.ManyToManyField(Topping, blank=True, related_name="pizza_toppings")

    def __str__(self):
        return f"{self.pizzaType} {self.pizza} - Toppings: {self.pizzaToppings}"

class SubExtra(models.Model):
    subExtra = models.CharField(max_length=63)

    def __str__(self):
        return f"{self.subExtra}"

class Sub(models.Model):
    sub = models.CharField(max_length=63)
    size = models.ForeignKey(Size, on_delete=models.CASCADE, related_name="sub_size")
    subExtra = models.ManyToManyField(SubExtra, blank=True, related_name="sub_extra")

    def __str__(self):
        return f"{self.sub}"

class Pasta(models.Model):
    pasta = models.CharField(max_length=63)

    def __str__(self):
        return f"{self.pasta}"

class Salad(models.Model):
    salad = models.CharField(max_length=63)

    def __str__(self):
        return f"{self.salad}"

class Platter(models.Model):
    platter = models.CharField(max_length=63)
    size = models.ForeignKey(Size, on_delete=models.CASCADE, related_name="platter_size")

    def __str__(self):
        return f"{self.platter}"

# Create your models here.
