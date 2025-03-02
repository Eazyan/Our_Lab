from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .routers import devices, bookings
from . import models
from .database import engine, get_db, SessionLocal
from sqlalchemy.orm import Session
import time
import psycopg2
import os

def wait_for_db():
    db_url = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@postgres/ourlab")
    # Получаем параметры соединения из URL
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

# Ждем, пока база данных станет доступной
wait_for_db()

# Создаем таблицы в базе данных
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Our Lab API")

# Настройка CORS для работы с фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],  # Добавляем имя контейнера
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роутеры
app.include_router(devices.router)
app.include_router(bookings.router)

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
