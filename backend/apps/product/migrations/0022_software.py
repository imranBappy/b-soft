# Generated by Django 5.1.3 on 2025-05-11 17:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0021_productaccess_attributeoption_productaccess_prodduct_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Software',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('buy_link', models.URLField()),
                ('tutorial_link', models.URLField(blank=True, null=True)),
                ('official_site', models.URLField(blank=True, null=True)),
                ('download_link', models.URLField(blank=True, null=True)),
            ],
        ),
    ]
