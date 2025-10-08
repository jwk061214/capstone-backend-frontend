# backend/app/routers/users.py
from fastapi import APIRouter, Depends, HTTPException
from app.utils.deps import get_current_user
from app.firebase_config import db
from app.schemas import UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_me(user=Depends(get_current_user)):
    """
    🔍 로그인한 사용자 자신의 정보를 반환합니다.

    - 인증된 JWT 토큰을 `Authorization: Bearer <token>` 헤더로 전달해야 합니다.
    - Firestore에서 최신 사용자 정보를 가져와 반환합니다.
    """
    try:
        user_ref = db.collection("users").document(user["uid"]).get()
        if not user_ref.exists:
            raise HTTPException(status_code=404, detail="사용자 정보를 찾을 수 없습니다.")

        user_data = user_ref.to_dict()

        return {
            "uid": user_data.get("uid"),
            "email": user_data.get("email"),
            "name": user_data.get("name"),
            "role": user_data.get("role", "user")
        }

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="사용자 정보 조회 중 오류가 발생했습니다.")
