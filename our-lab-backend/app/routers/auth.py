from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
import jwt
from datetime import datetime, timedelta, timezone

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

class LoginRequest(BaseModel):
    role: str

@router.post("/login")
async def login(request: LoginRequest, response: Response):
    if request.role not in ["student", "teacher", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role")
    
    token_data = {
        "role": request.role,
        "exp": datetime.now(timezone.utc) + timedelta(days=1)
    }
    
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    
    # Устанавливаем куки с токеном
    response.set_cookie(
        key="token",
        value=token,
        httponly=True,  # Защита от XSS - токен недоступен из JavaScript
        secure=False,   # Временно отключаем для разработки (в продакшене должно быть True)
        samesite="lax", # Защита от CSRF
        max_age=86400   # 24 часа
    )
    
    return {"status": "success"} 