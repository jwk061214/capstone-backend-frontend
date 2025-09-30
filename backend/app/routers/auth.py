from fastapi import APIRouter, HTTPException
from firebase_admin import auth
import requests
import os
from app.schemas import UserCreate, UserResponse, LoginRequest, LoginResponse
from app.firebase_config import db
import datetime
from dotenv import load_dotenv

load_dotenv()
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
    
@router.post("/login", response_model=LoginResponse)
def login(user: LoginRequest):
    try:
        # Firebase REST API를 통한 로그인
        api_key = os.getenv("FIREBASE_WEB_API_KEY")
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={api_key}"

        payload = {
            "email": user.email,
            "password": user.password,
            "returnSecureToken": True
        }

        response = requests.post(url, json=payload)
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 올바르지 않습니다")

        data = response.json()

        # Firestore에 last_login 갱신
        db.collection("users").document(data["localId"]).update({
            "last_login": datetime.datetime.utcnow()
        })

        return LoginResponse(
            access_token=data["idToken"],
            expires_in=int(data["expiresIn"])
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"로그인 실패: {str(e)}")