# app/routers/admin.py
from fastapi import APIRouter, Depends
from app.firebase_config import db
from app.utils.auth_utils import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

# 모든 유저 조회 (관리자 전용)
@router.get("/users")
def list_users(user=Depends(require_admin)):
    users_ref = db.collection("users").stream()
    users = []
    for u in users_ref:
        data = u.to_dict()
        data["uid"] = u.id
        users.append(data)
    return {"users": users}

