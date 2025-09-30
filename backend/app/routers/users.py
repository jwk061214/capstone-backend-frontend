# backend/app/routers/users.py
from fastapi import APIRouter, Depends
from app.utils.auth_utils import verify_token

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me")
def get_current_user(user=Depends(verify_token)):
    return {
        "uid": user["uid"],
        "email": user.get("email"),
        "name": user.get("name", "No name")
    }
