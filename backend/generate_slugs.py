# generate_slugs.py

import os
import django
from django.utils.text import slugify

# Set this to your project's settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")  # <-- change this!

django.setup()
from apps.product.models import Product  


def generate_slugs():
    products = Product.objects.all()
    for product in products:
        if not product.slug:
            product.slug = f"{slugify(product.name.lower())}-{product.pk}"
            product.save()
            print(f"Updated: {product.name} -> {product.slug}")

if __name__ == "__main__":
    generate_slugs()
