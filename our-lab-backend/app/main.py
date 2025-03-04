from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .routers import devices, bookings, auth
from . import models
from .database import engine, get_db, SessionLocal
from sqlalchemy.orm import Session
import time
import psycopg2
import os
from sqlalchemy import text

def wait_for_db():
    db_url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@postgres/ourlab")
    db_params = {
        "dbname": "ourlab",
        "user": "postgres",
        "password": "postgres",
        "host": "postgres",
        "port": "5432"
    }
    
    max_retries = 30
    retries = 0
    while retries < max_retries:
        try:
            conn = psycopg2.connect(**db_params)
            conn.close()
            print("База данных доступна!")
            return
        except psycopg2.OperationalError:
            retries += 1
            print(f"База данных недоступна, ожидание... ({retries}/{max_retries})")
            time.sleep(2)
    
    print("Не удалось подключиться к базе данных после нескольких попыток.")

wait_for_db()

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Our Lab API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

app.include_router(devices.router)
app.include_router(bookings.router)
app.include_router(auth.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Our Lab API"}

@app.get("/debug/devices")
def debug_devices(db: Session = Depends(get_db)):
    """Эндпоинт для отладки - показывает все устройства в базе данных"""
    devices = db.query(models.Device).all()
    result = []
    for device in devices:
        result.append({
            "id": device.id,
            "name": device.name,
            "available": device.available,
            "description": device.description
        })
    return result

@app.get("/debug/clear-db")
def clear_database(db: Session = Depends(get_db)):
    """Эндпоинт для очистки базы данных (только для отладки)"""
    try:
        db.query(models.Booking).delete()
        db.query(models.Device).delete()
        
        db.execute(text("ALTER SEQUENCE bookings_id_seq RESTART WITH 1"))
        db.execute(text("ALTER SEQUENCE devices_id_seq RESTART WITH 1"))
        
        db.commit()
        
        return {
            "status": "success", 
            "message": "База данных успешно очищена и счетчики ID сброшены"
        }
    except Exception as e:
        db.rollback()
        return {
            "status": "error", 
            "message": f"Ошибка при очистке базы данных: {str(e)}"
        }
