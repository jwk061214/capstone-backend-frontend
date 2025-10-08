from fastapi import APIRouter, HTTPException
from firebase_admin import auth
import requests
import os
from app.schemas import UserCreate, UserResponse, LoginRequest, LoginResponse
from app.firebase_config import db
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
router = APIRouter(prefix="/auth", tags=["Auth"])

# ✅ 환경 변수 확인
FIREBASE_API_KEY = os.getenv("FIREBASE_WEB_API_KEY")
if not FIREBASE_API_KEY:
    raise RuntimeError("환경 변수 'FIREBASE_WEB_API_KEY'가 설정되지 않았습니다.")


@router.post("/register", response_model=UserResponse)
def register(user: UserCreate):
    """
    회원가입 API
    1️⃣ Firebase Auth 계정 생성
    2️⃣ Firestore에 사용자 문서 저장 (role=user)
    """
    try:
        # Firebase Auth 계정 생성
        user_record = auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.name
        )

        # Firestore에 사용자 정보 저장
        db.collection("users").document(user_record.uid).set({
            "uid": user_record.uid,
            "email": user.email,
            "name": user.name,
            "role": "user",  # 기본 권한
            "created_at": datetime.utcnow().isoformat(),
            "last_login": None
        })

        return UserResponse(
            uid=user_record.uid,
            email=user.email,
            name=user.name
        )

    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="이미 존재하는 이메일입니다.")
    except Exception:
        # 상세 에러 메시지는 보안상 숨김
        raise HTTPException(status_code=500, detail="회원가입 처리 중 오류가 발생했습니다.")


@router.post("/login", response_model=LoginResponse)
def login(user: LoginRequest):
    """
    로그인 API
    1️⃣ Firebase REST API를 사용해 사용자 인증
    2️⃣ idToken 반환 및 Firestore last_login 갱신
    """
    try:
        # Firebase REST API 로그인 요청
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"

        payload = {
            "email": user.email,
            "password": user.password,
            "returnSecureToken": True
        }

        response = requests.post(url, json=payload)
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 올바르지 않습니다.")

        data = response.json()

        # Firestore last_login 갱신
        user_ref = db.collection("users").document(data["localId"])
        if user_ref.get().exists:
            user_ref.update({"last_login": datetime.utcnow().isoformat()})

        # access_token 및 만료 시간 반환
        return LoginResponse(
            access_token=data["idToken"],
            token_type="bearer",
            expires_in=int(data.get("expiresIn", 3600))
        )

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=500, detail="로그인 처리 중 오류가 발생했습니다.")
