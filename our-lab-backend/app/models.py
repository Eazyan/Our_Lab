from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from .database import Base

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    characteristics = Column(String)
    available = Column(Boolean, default=True)
    
    bookings = relationship("Booking", back_populates="device")


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"))
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status = Column(String, default="Ожидает подтверждения")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    device = relationship("Device", back_populates="bookings")

