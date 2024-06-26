# Generated by Django 5.0.6 on 2024-06-14 18:31

import django.db.models.deletion
import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0046_alter_currency_currency'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('title', models.CharField(default=None, max_length=240)),
                ('description', models.CharField(blank=True, default=None, max_length=240)),
                ('order', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='api.order')),
                ('robot', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='api.robot')),
            ],
        ),
    ]
