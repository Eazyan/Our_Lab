from fastapi import APIRouter, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from pydantic import BaseModel
from typing import Optional

from ..database import get_db
from .. import models
from ..utils import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: str = "student"

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    print(f"Попытка регистрации пользователя: {user.username}")
    print(f"Email: {user.email}")
    print(f"Роль: {user.role}")
    
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        print(f"Пользователь с именем {user.username} уже существует")
        raise HTTPException(
            status_code=400,
            detail="Пользователь с таким именем уже существует"
        )
    
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        print(f"Пользователь с email {user.email} уже существует")
        raise HTTPException(
            status_code=400,
            detail="Пользователь с таким email уже существует"
        )
    
    print("Создание хеша пароля...")
    hashed_password = get_password_hash(user.password)
    
    print("Создание нового пользователя...")
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    print(f"Пользователь успешно зарегистрирован: {db_user.username}")
    return db_user

@router.post("/login", response_model=Token)
async def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    print(f"Попытка входа пользователя: {login_data.username}")
    
    user = db.query(models.User).filter(models.User.username == login_data.username).first()
    if not user:
        print(f"Пользователь не найден: {login_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверное имя пользователя или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"Пользователь найден: {user.username}")
    print(f"Проверка пароля...")
    
    if not verify_password(login_data.password, user.hashed_password):
        print(f"Неверный пароль для пользователя: {login_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверное имя пользователя или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    print(f"Пароль верный")
    
    if not user.is_active:
        print(f"Пользователь неактивен: {login_data.username}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Неактивный пользователь"
        )
    
    print(f"Создание токена доступа...")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role},
        expires_delta=access_token_expires
    )
    
    print(f"Вход успешно выполнен для пользователя: {login_data.username}")
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user 