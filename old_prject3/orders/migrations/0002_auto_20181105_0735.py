# Generated by Django 2.0.3 on 2018-11-05 07:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pizza',
            name='pizzaToppings',
        ),
        migrations.RemoveField(
            model_name='sub',
            name='subExtra',
        ),
    ]