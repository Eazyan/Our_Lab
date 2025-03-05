from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from .models import UserRole

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    group: Optional[str] = None
    department: Optional[str] = None
    role: UserRole = UserRole.STUDENT

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    group: Optional[str] = None
    department: Optional[str] = None
    password: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class DeviceBase(BaseModel):
    name: str
    description: Optional[str] = None
    status: str = "available"

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class Device(DeviceBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class BookingBase(BaseModel):
    device_id: int
    start_time: datetime
    end_time: datetime
    status: str = "pending"

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    device_id: Optional[int] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    status: Optional[str] = None

class Booking(BookingBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    user: User
    device: Device

    class Config:
        from_attributes = True

class UserStats(BaseModel):
    total_bookings: int
    active_bookings: int
    completed_bookings: int
    cancelled_bookings: int
