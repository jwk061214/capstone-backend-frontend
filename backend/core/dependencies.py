# app/core/dependencies.py
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from app.core.security import security, decode_token
from app.firebase_config import db

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(credentials.credentials)
    uid = payload.get("sub")
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid token")
    user_ref = db.collection("users").document(uid).get()
    if not user_ref.exists:
        raise HTTPException(status_code=404, detail="User not found")
    return user_ref.to_dict()

def require_role(role: str):
    def wrapper(user=Depends(get_current_user)):
        if user["role"] != role:
            raise HTTPException(status_code=403, detail=f"{role} 권한이 필요합니다")
        return user
    return wrapper
