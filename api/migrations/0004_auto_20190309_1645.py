# Generated by Django 2.1.5 on 2019-03-09 16:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20190303_0836'),
    ]

    operations = [
        migrations.CreateModel(
            name='PricePerRoomType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('price', models.DecimalField(decimal_places=2, max_digits=6)),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.RoomType')),
                ('hotel', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='api.Hotel')),
            ],
        ),
        migrations.RemoveField(
            model_name='hotelroom',
            name='price',
        ),
    ]
