from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from .routers import devices, bookings, auth, profile
from . import models
from .database import engine, get_db
from sqlalchemy.orm import Session
import time
import psycopg2
import os
from sqlalchemy import text

def wait_for_db():
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
            return
        except psycopg2.OperationalError:
            retries += 1
            time.sleep(2)

wait_for_db()

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Our Lab API")

# Настройки CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://frontend:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://backend:8000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600
)

app.include_router(devices.router)
app.include_router(bookings.router)
app.include_router(auth.router)
app.include_router(profile.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Our Lab API!"}

@app.get("/debug/devices")
def debug_devices(db: Session = Depends(get_db)):
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

@app.get("/debug/reset-db")
def reset_database():
    try:
        models.Base.metadata.drop_all(bind=engine)
        
        with engine.connect() as conn:
            conn.execute(text("DROP SEQUENCE IF EXISTS users_id_seq CASCADE"))
            conn.execute(text("DROP SEQUENCE IF EXISTS devices_id_seq CASCADE"))
            conn.execute(text("DROP SEQUENCE IF EXISTS bookings_id_seq CASCADE"))
            conn.commit()
        
        db_params = {
            "dbname": "ourlab",
            "user": "postgres",
            "password": "postgres",
            "host": "postgres",
            "port": "5432"
        }
        
        conn = psycopg2.connect(**db_params)
        conn.autocommit = True
        cur = conn.cursor()
        
        cur.execute("""
            SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = 'ourlab'
            AND pid <> pg_backend_pid();
        """)
        
        cur.execute("DROP DATABASE IF EXISTS ourlab")
        cur.execute("CREATE DATABASE ourlab")
        
        cur.close()
        conn.close()
        
        models.Base.metadata.create_all(bind=engine)
        
        with engine.connect() as conn:
            conn.execute(text("CREATE SEQUENCE users_id_seq"))
            conn.execute(text("CREATE SEQUENCE devices_id_seq"))
            conn.execute(text("CREATE SEQUENCE bookings_id_seq"))
            conn.commit()
        
        return {
            "status": "success", 
            "message": "База данных успешно сброшена и пересоздана"
        }
    except Exception as e:
        return {
            "status": "error", 
            "message": f"Ошибка при сбросе базы данных: {str(e)}"
        }
