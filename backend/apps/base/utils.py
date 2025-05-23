from django.apps import apps
from graphql import GraphQLError
from django.core.mail import send_mail
from django.conf import settings
import re
import requests
import base64
import random
import string
import uuid

from django.contrib.auth import get_user_model


def url_to_base64(url):
    try:
        response = requests.get(url)
        if response.status_code == 200:
            image_base64 = base64.b64encode(response.content).decode()
            return image_base64
    except Exception as e:
        default_image = url_to_base64(
            "https://w3storage.s3-ap-south-1.amazonaws.com/wrightalentstage/profile/emdawaL8LkhUaqR7K8MjV1.jpeg"
        )
        return default_image
    return ""


def send_verification_email(email, token):
    subject = "Verify your email address"
    message = f"Please click the following link to verify your email address: {settings.SITE_URL}/verify-email/?token={str(token)}"
    # from_email = 'noreply@example.com'
    recipient_list = [email]
    send_mail(
        subject=subject, message=message, from_email=None, recipient_list=recipient_list
    )


def send_password_reset_email(email, uid, token):
    subject = "Reset Your Password"
    message = f"Click on the following link to reset your password: {settings.SITE_URL}/password-reset/?uid={uid}&token={token}"
    # from_email = 'noreply@example.com'
    recipient_list = [email]
    send_mail(
        subject=subject, message=message, from_email=None, recipient_list=recipient_list
    )


def get_absolute_path(info, file):
    """
    Get all the fields related to a model
    """
    file_path = None
    if file and str(file.url).startswith("http"):
        file_path = file.url
    elif file and not str(file.url).startswith("http"):
        host = info.context.headers.get("host")
        file_path = (
            f"http://{host}{file.url}"
            if re.findall("localhost", str(host)) or re.findall("127.0.0.1", str(host))
            else f"https://{host}{file.url}"
        )
    return file_path


def get_object_by_id(model, object_id):
    try:
        obj = model.objects.get(id=object_id)
        return obj
    except model.DoesNotExist:
        raise GraphQLError(
            message=f"{model.__name__} matching query does not exist.",
            extensions={
                "errors": {
                    "id": f"No instance was found associated with '{object_id}'"
                },
                "code": "invalid_request",
            },
        )


def get_object_by_kwargs(model, kwargs: dict):
    try:
        obj = model.objects.get(**kwargs)
        return obj
    except model.DoesNotExist:
        raise GraphQLError(
            message=f"{model.__name__} matching query does not exist.",
            extensions={
                "errors": {
                    field: f"No instance was found associated with '{value}'"
                    for field, value in kwargs.items()
                },
                "code": "invalid_request",
            },
        )


def camel_case_format(word: str):
    """
    Transform a string from snake_case format to camelCase
    """
    f_word = str(word).split("_")
    return f_word[0] + "".join(w.capitalize() for w in f_word[1:])


def create_graphql_error(form):
    error_data = {
        camel_case_format(error): err
        for error in form.errors
        for err in form.errors[error]
    }
    raise GraphQLError(
        message="Invalid input request.",
        extensions={"errors": error_data, "code": "invalid_input"},
    )


def create_serializer_graphql_error(serializer):
    error_data = {
        camel_case_format(field): err
        for field, errors in serializer.errors.items()
        for err in errors
    }

    raise GraphQLError(
        message="Invalid input request.",
        extensions={"errors": error_data, "code": "invalid_input"},
    )


def get_model_by_name(model_name):
    model = None
    for app in apps.get_app_configs():
        try:
            model = apps.get_model(app.label, model_name)
            if model:
                return model
        except LookupError:
            continue
    raise GraphQLError(
        f"Model '{model_name}' not found.",
        extensions={"errors": {"message": f"Model '{model_name}' not found."}},
    )


def get_object_by_id_or_none(
    model, id=None, default_value=None, check_delete=False, extra_fields={}
):
    """if object with the given id not found raise GraphqlError else return None"""
    if id:
        if extra_fields:
            extra_fields["id"] = id
            obj = get_object_by_kwargs(model, extra_fields)
        else:
            obj = get_object_by_id(model, id)
        if check_delete and obj.is_deleted:
            raise GraphQLError(
                message="Can not do operations on already deleted object.",
                extensions={
                    "errors": {
                        "message": "Can not do operations on already deleted object."
                    }
                },
            )
        return obj

    return default_value


def generate_message(instance, kwargs):
    action = (
        "Deleted" if kwargs.get("is_deleted") else "Updated" if instance else "Created"
    )
    return f"{action} successfully."


def convert_django_object_to_dict(obj, exclude_fields=[], *args, **kwargs):
    from django.db.models.fields.related import (
        ForeignKey,
        OneToOneField,
        ManyToManyField,
    )
    from django.db.models.fields.reverse_related import (
        ForeignObjectRel,
        ManyToOneRel,
        OneToOneRel,
        ManyToManyRel,
    )

    obj_dict = {}

    def covert_args_to_str(*args):
        l = [a.name for a in list(args)]
        if len(l) > 1:
            l.reverse()
            return "__".join(l)
        return l[0]

    if not obj is None:
        for field in obj._meta.get_fields():
            if not isinstance(
                field, (ManyToOneRel, ForeignObjectRel, OneToOneRel, ManyToManyRel)
            ):
                if covert_args_to_str(field, *args) in exclude_fields:
                    pass
                elif isinstance(field, (OneToOneField, ForeignKey)):
                    obj_dict[field.name] = convert_django_object_to_dict(
                        getattr(obj, field.name), exclude_fields, field, *args
                    )
                elif isinstance(field, ManyToManyField):
                    obj_dict[field.name] = [
                        convert_django_object_to_dict(
                            m_obj, exclude_fields, field, *args
                        )
                        for m_obj in getattr(obj, field.name).all()
                    ]
                else:
                    value = getattr(obj, field.name)
                    obj_dict[field.name] = value

    return obj_dict


def generate_random_number():
    return str(random.randint(1000000000, 9999999999))


def generate_unique_username(email):
    User = get_user_model()
    # Extract the part of the email before the @ symbol
    email_prefix = email.split("@")[0]

    # Remove any non-alphanumeric characters and convert to lowercase
    clean_email_prefix = "".join(e for e in email_prefix if e.isalnum()).lower()

    # Generate a random string of characters
    random_string = "".join(random.choices(string.ascii_letters + string.digits, k=6))

    # Combine the cleaned email prefix and random string
    username = clean_email_prefix + random_string

    # Check if the username is already taken, and if so, recursively call the function again
    if User.objects.filter(username=username).exists():
        return generate_unique_username(email)

    return username


def raise_graphql_error(message: str, code="invalid_request", field_name=None):
    """
    Raise graphql error by message and code
    """
    extensions = {"code": code}
    if field_name:
        extensions["errors"] = {field_name: message}
    else:
        extensions["message"] = message
    raise GraphQLError(message=message, extensions=extensions)


def get_object_or_none(model, **kwargs):
    try:
        return model.objects.get(**kwargs)
    except model.DoesNotExist:
        return None


import random


def generate_otp():
    otp = ""
    for i in range(6):
        otp += str(random.randint(0, 9))
    return otp


def get_absolute_path(info, file):
    """
    Get all the fields related to a model
    """
    file_path = None
    if file and str(file.url).startswith("http"):
        file_path = file.url
    elif file and not str(file.url).startswith("http"):
        host = info.context.headers.get("host")
        file_path = (
            f"http://{host}{file.url}"
            if re.findall("localhost", str(host))
            else f"https://{host}{file.url}"
        )
    return file_path



def create_token():
    return uuid.uuid4()

def generate_otp():
    otp = ''
    for x in range(4):
        otp += str(random.randint(1, 9))
    return otp

def generate_order_id(prefix="B", length=3):
    """
    Generates a random order ID.
    :param prefix: Optional prefix for the order ID.
    :param length: Length of the random part of the order ID.
    :return: A unique order ID string.
    """
    random_part = ''.join(random.choices(string.digits, k=length))
    return f"{prefix}{random_part}"


 