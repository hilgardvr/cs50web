# Generated by Django 2.0.3 on 2018-11-08 10:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0005_orders'),
    ]

    operations = [
        migrations.AddField(
            model_name='orders',
            name='checkedout',
            field=models.BooleanField(default=False),
        ),
    ]
