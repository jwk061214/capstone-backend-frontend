from fastapi import APIRouter, HTTPException
from firebase_admin import auth
from app.firebase_config import db
from app.schemas import UserCreate, UserResponse
import datetime

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate):
    try:
        # Firebase Auth 계정 생성
        user_record = auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.name
        )

        # Firestore 저장
        db.collection("users").document(user_record.uid).set({
            "email": user.email,
            "name": user.name,
            "role": "user",  # 기본 권한
            "created_at": datetime.datetime.utcnow(),
            "last_login": None
        })

        return UserResponse(uid=user_record.uid, email=user.email, name=user.name)

    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="이미 존재하는 이메일")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"회원가입 실패: {str(e)}")