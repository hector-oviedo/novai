"""
Handles JWT creation, verification, and extracting user_id from an HttpOnly cookie.
"""

import jwt
import hashlib
from datetime import datetime, timedelta
from fastapi import Request, HTTPException
from config import Config

def create_access_token(data: dict, expires_minutes: int = Config.ACCESS_TOKEN_EXPIRE_MINUTES):
    """
    Create a JWT with a given payload and expiration time in minutes.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        Config.SECRET_KEY,
        algorithm=Config.ALGORITHM
    )
    return encoded_jwt

def decode_token(token: str):
    """
    Decode a JWT. Raise HTTPException if invalid or expired.
    Returns user_id if successful.
    """
    try:
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=[Config.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_current_user_id(request: Request):
    """
    FastAPI dependency to extract the JWT from the HttpOnly 'token' cookie.
    If cookie is missing/invalid, raise HTTP 401.
    """
    token = request.cookies.get("token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated. Missing token cookie.")

    user_id = decode_token(token)  # May raise 401 if invalid/expired
    return user_id

def hash_password(password: str) -> str:
    """
    Basic SHA-256 password hashing. 
    For production use a stronger approach (bcrypt/argon2 + salt).
    """
    return hashlib.sha256(password.encode('utf-8')).hexdigest()