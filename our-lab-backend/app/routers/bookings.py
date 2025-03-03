from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timezone
import pytz

from ..database import get_db
from .. import models, schemas

router = APIRouter(
    prefix="/bookings",
    tags=["bookings"]
)

@router.get("/", response_model=List[dict])
def get_bookings(db: Session = Depends(get_db)):
    bookings = db.query(models.Booking).all()
    result = []
    for booking in bookings:
        device = db.query(models.Device).filter(models.Device.id == booking.device_id).first()
        booking_dict = schemas.Booking.model_validate(booking).model_dump()
        booking_response = {
            "id": booking.id,
            "deviceId": booking.device_id,
            "deviceName": device.name if device else "Неизвестный прибор",
            "startTime": booking.start_time.isoformat(),
            "endTime": booking.end_time.isoformat(),
            "status": booking.status,
            "created_at": booking.created_at.isoformat() if booking.created_at else None
        }
        result.append(booking_response)
    return result

@router.post("/", response_model=schemas.Booking, status_code=status.HTTP_201_CREATED)
def create_booking(booking: schemas.BookingCreate, db: Session = Depends(get_db)):
    device = db.query(models.Device).filter(models.Device.id == booking.device_id).first()
    if not device:
        raise HTTPException(status_code=404, detail=f"Прибор с ID {booking.device_id} не найден")
    
    start_time = booking.start_time
    end_time = booking.end_time
    
    print(f"Полученное время от клиента: Начало={start_time}, Конец={end_time}")
    
    start_hour = start_time.hour
    start_minute = start_time.minute
    end_hour = end_time.hour
    end_minute = end_time.minute
    
    start_time_minutes = start_hour * 60 + start_minute
    end_time_minutes = end_hour * 60 + end_minute
    
    business_start_minutes = 8 * 60 + 30
    business_end_minutes = 17 * 60
    
    print(f"Время в минутах: Начало={start_time_minutes}, Конец={end_time_minutes}")
    print(f"Рабочее время: {business_start_minutes}-{business_end_minutes}")
    
    if start_time_minutes < business_start_minutes or end_time_minutes > business_end_minutes:
        raise HTTPException(
            status_code=400, 
            detail=f"Бронирование возможно только в рабочее время с 8:30 до 17:00. Ваше время: {start_hour}:{start_minute}-{end_hour}:{end_minute}"
        )
    
    overlapping_bookings = db.query(models.Booking).filter(
        models.Booking.device_id == booking.device_id,
        models.Booking.end_time > booking.start_time,
        models.Booking.start_time < booking.end_time
    ).all()
    
    if overlapping_bookings:
        raise HTTPException(status_code=400, detail="Это время уже забронировано")
    
    new_booking = models.Booking(**booking.model_dump())
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    response = schemas.Booking.model_validate(new_booking).model_dump()
    response["device_name"] = device.name
    
    return response

@router.get("/{booking_id}", response_model=schemas.Booking)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    
    response = schemas.Booking.model_validate(booking).model_dump()
    response["device_name"] = booking.device.name if booking.device else "Неизвестный прибор"
    
    return response

@router.patch("/{booking_id}", response_model=schemas.Booking)
def update_booking(booking_id: int, booking_update: schemas.BookingUpdate, db: Session = Depends(get_db)):
    db_booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if db_booking is None:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    
    update_data = booking_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_booking, key, value)
    
    db.commit()
    db.refresh(db_booking)
    
    response = schemas.Booking.model_validate(db_booking).model_dump()
    response["device_name"] = db_booking.device.name if db_booking.device else "Неизвестный прибор"
    
    return response

@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(booking_id: int, db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Бронирование не найдено")
    
    db.delete(booking)
    db.commit()
    return None 