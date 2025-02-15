"""
User registration, login, and logout. 
Sets and clears the HttpOnly token cookie for authentication.
"""

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid

from database import get_db
from security import hash_password, create_access_token, get_current_user_id
from models.user import User
from config import Config  # <--- IMPORTANT! Needed for max_age=Config.ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()

class UserRegisterRequest(BaseModel):
    username: str
    password: str
    email: Optional[EmailStr] = None

class UserLoginRequest(BaseModel):
    username: str
    password: str

@router.post("/register")
def register_user(payload: UserRegisterRequest, db: Session = Depends(get_db)):
    """
    Registers a new user with username, password, optional email.
    Returns user_id on success.
    """
    existing_user = db.query(User).filter(User.username == payload.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists.")

    new_user = User(
        user_id=str(uuid.uuid4()),
        username=payload.username,
        password=hash_password(payload.password),
        email=payload.email
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered.",
        "user_id": new_user.user_id
    }

@router.post("/login")
def login_user(
    payload: UserLoginRequest,
    db: Session = Depends(get_db),
    response: Response = None
):
    """
    Authenticates user by username/password, returns user_id,
    and sets an HttpOnly cookie containing the JWT token.
    """
    user = db.query(User).filter(User.username == payload.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    if user.password != hash_password(payload.password):
        raise HTTPException(status_code=401, detail="Invalid credentials.")

    # Generate JWT
    access_token = create_access_token(data={"sub": user.user_id})

    # Set HttpOnly cookie
    response.set_cookie(
        key="token",
        value=access_token,
        httponly=True,
        max_age=Config.ACCESS_TOKEN_EXPIRE_MINUTES * 60, 
        samesite="lax",
        secure=False  # In production, set secure=True + use HTTPS
    )

    return {
        "message": "Login successful",
        "user_id": user.user_id
    }

@router.post("/logout")
def logout_user(response: Response):
    """
    Clears the 'token' cookie so the user can no longer access protected routes.
    """
    response.delete_cookie("token")
    return {"message": "Logged out"}

@router.get("/profile")
def get_profile(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    Endpoint to get the currently logged-in user's profile
    (if you want to confirm they're logged in).
    """
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found in DB.")
    return {
        "user_id": user.user_id,
        "username": user.username,
        "email": user.email
    }
