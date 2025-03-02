from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

# Device schemas
class DeviceBase(BaseModel):
    name: str
    description: Optional[str] = None
    characteristics: Optional[str] = None
    available: bool = True

class DeviceCreate(DeviceBase):
    pass

class DeviceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    characteristics: Optional[str] = None
    available: Optional[bool] = None

class Device(DeviceBase):
    id: int

    class Config:
        from_attributes = True

# Booking schemas
class BookingBase(BaseModel):
    device_id: int
    start_time: datetime
    end_time: datetime
    status: str = "Ожидает подтверждения"

class BookingCreate(BookingBase):
    pass

class BookingUpdate(BaseModel):
    status: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None

class Booking(BookingBase):
    id: int
    created_at: datetime
    device_name: Optional[str] = None  # Для совместимости с текущим фронтендом

    class Config:
        from_attributes = True
