import jwt
from django.conf import settings
from django.utils import timezone
from graphql import GraphQLError
from datetime import datetime
from functools import wraps
from graphql import GraphQLError
from apps.accounts.models import User

class TokenManager:
    ALGORITHM = 'HS256'
    SECRET_KEY = settings.SECRET_KEY
    
    def __init__(self, algorithm='HS256'):
        self.ALGORITHM = algorithm
        self.SECRET_KEY = settings.SECRET_KEY,
    
    
    @staticmethod
    def get_token(payload, token_type='access'):
        """
            Get access token by encoding user-info, secret-key and timestamp
        """
        origIat = timezone.now().timestamp()
        exp = datetime.utcnow() + settings.JWT_EXPIRATION_DELTA
        return jwt.encode({
            'type': token_type, 
            'exp': exp,
            'origIat': origIat,
            **payload
        }, TokenManager.SECRET_KEY, TokenManager.ALGORITHM)
        
    @staticmethod
    def get_access(payload):
        """"
            Get  access token through timestamp
        """ 
        return  TokenManager.get_token(payload)
    
    @staticmethod
    def decode_token(token):
        """
            Decode access token by token, secret-key and timestamp
        """
        try:
            decode = jwt.decode(token, key=TokenManager.SECRET_KEY,  algorithms=[TokenManager.ALGORITHM])
        except :
            raise GraphQLError(message='Your token is expired.')
        return decode
    
    @staticmethod
    def get_refresh(payload):
        """
           Get access token through timestamp and token-type. 
        """
        token_type = 'refresh'
        return TokenManager.get_token(payload, token_type)
    
    @staticmethod
    def get_email(token):
        """
            Get user email by decoding token.
        """ 
        decode =  TokenManager.decode_token(token)
        if decode:
            return decode.get('email')
        return None


def isAuthenticated(roles=None):
    """
        Decorator to restrict access to queries and mutations base on user roles.
        
        Args
            roles (list): A list of user required to access the resourse. 
                if None, only authentication is checkend
        
    """
    def decorator(func):
        @wraps(func)
        def wrapper(root, info, *args, **kwargs):
            # Extract the authorization header
            auth_header = info.context.headers.get("Authorization")
            if not auth_header:
               raise GraphQLError("You are not authenticated.")
            # Validate the header format and extract the token
            parts = auth_header.split(" ")
            
            if len(parts) != 2 or parts[0].lower() != "bearer":
                raise GraphQLError("Invalid authorization header format.")
            
            token = parts[1]
            try :
                decoded_token  = TokenManager.decode_token(token)
                user_email = decoded_token.get('email')
                user = User.objects.get(email=user_email)
                
            except Exception as e:
                raise GraphQLError(f"Authentication failed: {str(e)}")
            
            if not user.is_active:
                    raise GraphQLError("Your account is inactive.")
            
            # Attach user and authentication status to the context
            info.context.User = user
            info.context.is_authenticated =  True
            if not roles:
                return func(root, info, *args, **kwargs)
            if ( not user.role and roles):
                raise GraphQLError("You do not have the required permissions to access this resource")
                
            user_role = user.role.name
            if not user_role  in roles:
                raise GraphQLError("You do not have the required permissions to access this resource")
                
            return func(root, info, *args, **kwargs)
        return wrapper
    return decorator