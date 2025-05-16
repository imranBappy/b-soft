from backend.celery import app
from apps.base.mail import send_mail_from_template
import logging

logger = logging.getLogger(__name__)

@app.task
def send_email_on_delay(template, context, subject, email):
    send_mail_from_template(template, context, subject, email)