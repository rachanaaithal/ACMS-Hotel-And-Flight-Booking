# Generated by Django 2.1.5 on 2019-03-16 14:20

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_auto_20190313_1618'),
    ]

    operations = [
        migrations.AlterField(
            model_name='roomavailability',
            name='from_date',
            field=models.DateField(default=datetime.date.today),
        ),
        migrations.AlterField(
            model_name='roomavailability',
            name='to_date',
            field=models.DateField(default=datetime.date.today),
        ),
    ]