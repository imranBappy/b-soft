from django.conf import settings
from django.core.mail import EmailMessage
from django.forms.fields import EmailField
from django.template.loader import get_template

SENDER = settings.DEFAULT_FROM_EMAIL
CHARSET = "UTF-8"

def get_cleaned_emails(emails):
    """
        Provide cleaned email-list from a list of emails
    """
    cleaned_emails = []
    e = EmailField()
    for email in emails:
        try:
            e.clean(email)
            cleaned_emails.append(email)
        except Exception as ex:
            print("Invalid Email", ex, email)
    return cleaned_emails


def divide_chunks(recipient, n):
    """
        Divide recipients' list to a range(n).
    """
    for i in range(0, len(recipient), n):
        yield recipient[i: i + n]

def send_mail(
    subject,
    body,
    recipient,
    attachments=[],
    attachments_files={},
    bcc=False
) -> None:
    """
        Send email through some default fields.
    """
    recipient = recipient if type(recipient) == list else [recipient]
    recipient = get_cleaned_emails(recipient)
    for chunk in divide_chunks(recipient, 50):
        to_args = {}
        if bcc:
            to_args["bcc"] = chunk
        else:
            to_args["to"] = chunk
        msg = EmailMessage(
            subject, body, from_email=SENDER, **to_args
        )

        for attachment in attachments:
            msg.attach_file(attachment, mimetype="application/octet-stream")

        for name, attachment in attachments_files.items():
            msg.attach(name, attachment, mimetype="application/octet-stream")

        msg.content_subtype = "html"
        try:
            msg.send()
            print("Successful")
        except Exception as e:
            print(e, flush=True)
    
    
def send_mail_from_template(
    template,
    context_data,
    subject,
    recipient_list,
    attachments=[],
    bcc=False
) -> None:
    """
        Send email through some default fields and template.
    """
    template = get_template(template)
    context = context_data
    body = template.render(context)
    send_mail(subject, body, recipient_list, attachments, bcc=bcc)
