from passlib.context import CryptContext
from datetime import datetime, timedelta
import jwt
import os

from .models import User

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str):
    return pwd_context.hash(password)

def create_access_token(user: User) -> str:

    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    ACCESS_TOKEN_LIFETIME_HOURS = os.environ.get("ACCESS_TOKEN_LIFETIME_HOURS")

    expires_delta = timedelta(hours=int(ACCESS_TOKEN_LIFETIME_HOURS))
    expire = datetime.now() + expires_delta

    to_encode = {
        "id": user.id,
        "username": user.username,
        "exp": expire
    }
    
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm="HS256")
    return encoded_jwt