# Generated by Django 5.1.7 on 2025-03-11 19:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='actividad',
            name='estado',
            field=models.CharField(max_length=30),
        ),
        migrations.DeleteModel(
            name='EstadoActividad',
        ),
    ]
