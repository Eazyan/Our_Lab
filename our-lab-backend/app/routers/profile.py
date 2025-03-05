from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas, utils
from ..database import get_db
from ..auth import get_current_user

router = APIRouter(
    prefix="/profile",
    tags=["profile"]
)

@router.get("/", response_model=schemas.User)
async def get_profile(current_user: models.User = Depends(get_current_user)):
    """Получить профиль текущего пользователя"""
    return current_user

@router.put("/", response_model=schemas.User)
async def update_profile(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Обновить профиль пользователя"""
    update_data = user_update.dict(exclude_unset=True)
    
    if "password" in update_data:
        update_data["hashed_password"] = utils.get_password_hash(update_data.pop("password"))
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.get("/stats", response_model=schemas.UserStats)
async def get_user_stats(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получить статистику бронирований пользователя"""
    bookings = db.query(models.Booking).filter(models.Booking.user_id == current_user.id).all()
    
    return {
        "total_bookings": len(bookings),
        "active_bookings": len([b for b in bookings if b.status == "pending"]),
        "completed_bookings": len([b for b in bookings if b.status == "completed"]),
        "cancelled_bookings": len([b for b in bookings if b.status == "cancelled"])
    }

@router.get("/bookings", response_model=List[schemas.Booking])
async def get_user_bookings(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Получить все бронирования пользователя"""
    return db.query(models.Booking).filter(models.Booking.user_id == current_user.id).all() 