# backend/app/routers/admin.py
from fastapi import APIRouter, Depends, HTTPException
from app.firebase_config import db
from app.utils.auth_utils import require_admin
from datetime import datetime

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users")
def list_users(admin=Depends(require_admin)):
    """
    👑 관리자 전용 API: 전체 사용자 목록 조회
    
    - Firestore의 `users` 컬렉션을 불러와 UID, 이메일, 이름, 권한, 생성일, 마지막 로그인일을 반환합니다.
    - Authorization 헤더에 **관리자 토큰**을 포함해야 접근 가능합니다.
    """
    try:
        users_ref = db.collection("users").stream()
        users = []

        for doc in users_ref:
            data = doc.to_dict()
            users.append({
                "uid": data.get("uid", doc.id),
                "email": data.get("email"),
                "name": data.get("name"),
                "role": data.get("role", "user"),
                "created_at": _format_time(data.get("created_at")),
                "last_login": _format_time(data.get("last_login"))
            })

        # 생성일 기준 내림차순 정렬 (최근 가입자가 위로)
        users.sort(key=lambda u: u.get("created_at", ""), reverse=True)

        return {"total_users": len(users), "users": users}

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="사용자 목록을 불러오는 중 오류가 발생했습니다.")


def _format_time(value):
    """timestamp나 datetime 객체를 문자열로 안전하게 변환"""
    if not value:
        return None
    if isinstance(value, datetime):
        return value.isoformat()
    if hasattr(value, "isoformat"):
        return value.isoformat()
    return str(value)
