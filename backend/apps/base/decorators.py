from graphql_jwt.decorators import login_required

def role_required(allowed_roles):
    def decorator(func):
        def wrapper(root, info, *args, **kwargs):
            user = info.context.user
            if user.is_anonymous or user.role not in allowed_roles:
                raise Exception("Permission Denied!")
            return func(root, info, *args, **kwargs)
        return wrapper
    return decorator
