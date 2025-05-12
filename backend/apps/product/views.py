from django.shortcuts import render
from django.http import HttpResponse
from apps.product.tasks import send_email
from apps.product.models import Order
from apps.base.utils import get_object_or_none
from django.template.loader import render_to_string


def generate_invoice(request, order_id):
    order = get_object_or_none(Order, id=order_id)
    if  order is None or not order.user:
        return HttpResponse("Order is not found!")
    context = {
        'order': order,
    }
    body = render_to_string('invoice_template.html', context)
    send_email.delay(sub="Order Invoice", body=body, to=order.user.email)
    return HttpResponse("Successfully send email")