from fastapi import APIRouter, Depends, HTTPException, status
from app.utils.deps import get_current_user
from app.firebase_config import db
from app.schemas import UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_me(user=Depends(get_current_user)):
    """
    🔍 로그인한 사용자 자신의 정보를 반환합니다.
    
    - 인증된 JWT 토큰을 `Authorization: Bearer <token>` 헤더로 전달해야 합니다.
    - Firestore에서 사용자 정보를 가져오며, UID는 문서 ID를 기준으로 합니다.
    """
    try:
        uid = user.get("uid")
        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="UID가 토큰에서 확인되지 않았습니다."
            )

        # Firestore에서 최신 사용자 정보 조회
        user_doc = db.collection("users").document(uid).get()
        if not user_doc.exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="사용자 정보를 찾을 수 없습니다."
            )

        user_data = user_doc.to_dict() or {}
        # Firestore 문서 ID로부터 uid 강제 삽입 (응답 검증 대비)
        user_data["uid"] = uid

        # 응답 모델 스키마 일치
        return {
            "uid": user_data["uid"],
            "email": user_data.get("email", ""),
            "name": user_data.get("name", ""),
            "role": user_data.get("role", "user")
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"사용자 정보 조회 중 오류가 발생했습니다: {str(e)}"
        )
