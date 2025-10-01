# backend/app/routers/users.py
from fastapi import APIRouter, Depends
from app.utils.deps import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
def get_me(user=Depends(get_current_user)):
    """
    로그인한 사용자 자신의 정보 조회
    """
    return {
        "uid": user["uid"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"]
    }
