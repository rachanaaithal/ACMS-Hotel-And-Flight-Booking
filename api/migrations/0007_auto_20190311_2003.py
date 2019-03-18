# Generated by Django 2.1.5 on 2019-03-11 20:03

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_auto_20190311_1549'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='priceperroomtype',
            name='category',
        ),
        migrations.RemoveField(
            model_name='priceperroomtype',
            name='hotel',
        ),
        migrations.RemoveField(
            model_name='hotelroom',
            name='roomno',
        ),
        migrations.AddField(
            model_name='hotelroom',
            name='number_of_rooms',
            field=models.IntegerField(default=1, validators=[django.core.validators.MinValueValidator(1)]),
        ),
        migrations.AddField(
            model_name='hotelroom',
            name='price',
            field=models.DecimalField(decimal_places=2, default=0, max_digits=6),
        ),
        migrations.DeleteModel(
            name='PricePerRoomType',
        ),
    ]
