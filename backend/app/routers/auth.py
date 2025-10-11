from fastapi import APIRouter, HTTPException, Request, Depends
from firebase_admin import auth
import requests
import os
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from app.firebase_config import db
from app.schemas import UserCreate, UserResponse, LoginRequest, LoginResponse
from app.utils.deps import get_current_user  # ✅ 토큰 인증용 (이미 프로젝트에 있음)

load_dotenv()
router = APIRouter(prefix="/auth", tags=["Auth"])

# ---------------------------
# ✅ 환경 변수 확인
# ---------------------------
FIREBASE_API_KEY = os.getenv("FIREBASE_WEB_API_KEY")
if not FIREBASE_API_KEY:
    raise RuntimeError("환경 변수 'FIREBASE_WEB_API_KEY'가 설정되지 않았습니다.")


# ==========================================================
# 🟢 회원가입
# ==========================================================
@router.post("/register", response_model=UserResponse)
def register(user: UserCreate):
    """
    Firebase Auth + Firestore 사용자 등록
    """
    try:
        # 1️⃣ Firebase Auth 계정 생성
        user_record = auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.name
        )

        # 2️⃣ Firestore에 사용자 정보 저장
        now_kst = datetime.now(timezone.utc).astimezone(timezone(timedelta(hours=9)))
        db.collection("users").document(user_record.uid).set({
            "uid": user_record.uid,
            "email": user.email,
            "name": user.name,
            "role": "user",  # 기본 권한
            "created_at": now_kst.isoformat(),
            "last_login": None
        })

        return UserResponse(
            uid=user_record.uid,
            email=user.email,
            name=user.name
        )

    except auth.EmailAlreadyExistsError:
        raise HTTPException(status_code=400, detail="이미 존재하는 이메일입니다.")
    except Exception as e:
        print("❌ 회원가입 오류:", e)
        raise HTTPException(status_code=500, detail="회원가입 중 오류가 발생했습니다.")


# ==========================================================
# 🟡 로그인
# ==========================================================
@router.post("/login", response_model=LoginResponse)
def login(user: LoginRequest):
    """
    Firebase REST API 로그인 → idToken 반환
    + Firestore last_login 갱신
    """
    try:
        # ✅ Firebase REST API 엔드포인트
        url = f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}"

        payload = {
            "email": user.email,
            "password": user.password,
            "returnSecureToken": True
        }

        response = requests.post(url, json=payload)

        # 로그인 실패 처리
        if response.status_code != 200:
            print("❌ Firebase 로그인 실패:", response.text)
            raise HTTPException(status_code=401, detail="이메일 또는 비밀번호가 올바르지 않습니다.")

        data = response.json()
        uid = data.get("localId")

        if not uid:
            raise HTTPException(status_code=500, detail="Firebase 응답에 UID가 없습니다.")

        # ✅ Firestore 사용자 문서 갱신
        user_ref = db.collection("users").document(uid)
        now_kst = datetime.now(timezone.utc).astimezone(timezone(timedelta(hours=9)))

        if user_ref.get().exists:
            user_ref.update({"last_login": now_kst.isoformat()})
        else:
            # Firestore에 사용자 정보가 없으면 새로 생성
            user_ref.set({
                "uid": uid,
                "email": user.email,
                "role": "user",
                "created_at": now_kst.isoformat(),
                "last_login": now_kst.isoformat()
            })

        return LoginResponse(
            access_token=data["idToken"],
            token_type="bearer",
            expires_in=int(data.get("expiresIn", 3600)),
            
        )

    except HTTPException:
        raise
    except Exception as e:
        print("🔥 로그인 처리 오류:", e)
        raise HTTPException(status_code=500, detail="로그인 처리 중 오류가 발생했습니다.")


# ==========================================================
# 🔵 토큰 검증 (자동 로그인 유지용)
# ==========================================================
@router.get("/me", response_model=UserResponse)
def get_me(user=Depends(get_current_user)):
    """
    Firebase 토큰을 검증하고, 사용자 정보를 반환한다.
    (프론트에서 로그인 유지 시 자동 호출됨)
    """
    try:
        user_ref = db.collection("users").document(user["uid"]).get()
        if not user_ref.exists:
            raise HTTPException(status_code=404, detail="사용자 정보를 찾을 수 없습니다.")

        data = user_ref.to_dict()
        return UserResponse(
            uid=data["uid"],
            email=data["email"],
            name=data.get("name", "이름 없음")
        )
    except Exception as e:
        print("❌ 사용자 조회 오류:", e)
        raise HTTPException(status_code=401, detail="인증이 만료되었거나 유효하지 않습니다.")
