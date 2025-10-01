# backend/app/utils/deps.py
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth
from app.firebase_config import db

security = HTTPBearer()

def get_current_user(token: HTTPAuthorizationCredentials = Depends(security)):
    """
    Access Token을 Firebase Admin SDK로 검증 후, Firestore에서 유저 정보 가져옴
    """
    try:
        decoded_token = auth.verify_id_token(token.credentials)
        uid = decoded_token["uid"]

        user_doc = db.collection("users").document(uid).get()
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="사용자 정보를 찾을 수 없습니다")

        user_data = user_doc.to_dict()
        user_data["uid"] = uid
        return user_data

    except Exception:
        raise HTTPException(status_code=403, detail="유효하지 않은 토큰")


def require_role(role: str):
    """
    특정 role만 접근 허용하는 의존성
    예: Depends(require_role("admin"))
    """
    def role_checker(user=Depends(get_current_user)):
        if user.get("role") != role:
            raise HTTPException(status_code=403, detail="권한이 없습니다")
        return user
    return role_checker
