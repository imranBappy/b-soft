from celery import shared_task
from django.utils.timezone import now
import logging
from django.db.models import F
logger = logging.getLogger(__name__)
from apps.base.mail import send_mail


@shared_task
def send_email(sub, body, to):
    send_mail(sub, body, to)