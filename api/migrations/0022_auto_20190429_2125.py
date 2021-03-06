# Generated by Django 2.2 on 2019-04-29 21:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('api', '0021_auto_20190429_0714'),
    ]

    operations = [
        migrations.CreateModel(
            name='Flight',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, help_text='Unique ID for this particular flight', primary_key=True, serialize=False)),
                ('flightnumber', models.IntegerField(default=1)),
                ('airline_name', models.CharField(max_length=100)),
                ('takeoff_time', models.TimeField()),
                ('landing_time', models.TimeField()),
                ('on_date', models.DateField(default=django.utils.timezone.now)),
                ('image_link', models.CharField(default='', max_length=500)),
                ('tail_id', models.CharField(max_length=10)),
                ('destination', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='destination', to='api.City')),
                ('source', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='source', to='api.City')),
            ],
        ),
        migrations.CreateModel(
            name='Flight_Seats',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, help_text='Unique ID for this particular seat', primary_key=True, serialize=False)),
                ('number_of_seats', models.IntegerField(default=1)),
                ('seat_position', models.CharField(choices=[('a', 'Aisle'), ('m', 'Middle'), ('w', 'Window'), ('h', 'Herringbone'), ('p', 'Private')], default='m', help_text='position of seats', max_length=1)),
                ('base_price', models.DecimalField(decimal_places=2, default=0, max_digits=8)),
                ('max_price', models.DecimalField(decimal_places=2, default=0, max_digits=8)),
            ],
        ),
        migrations.CreateModel(
            name='SeatType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Enter type of seats', max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='Seat_Availability',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, help_text='Unique ID for this particular transaction', primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('bk', 'Booked'), ('pr', 'Processing'), ('dd', 'Dead')], help_text='Status', max_length=2)),
                ('on_date', models.DateField(default=django.utils.timezone.now)),
                ('price', models.DecimalField(decimal_places=2, default=0, max_digits=8)),
                ('booked_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('seat', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Flight_Seats')),
            ],
        ),
        migrations.AddField(
            model_name='flight_seats',
            name='category',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.SeatType'),
        ),
        migrations.AddField(
            model_name='flight_seats',
            name='flight',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Flight'),
        ),
    ]
