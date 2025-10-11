import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
from dotenv import load_dotenv

# ✅ .env 불러오기
load_dotenv()

# ✅ backend 디렉터리 기준으로 serviceAccountKey.json 절대 경로 계산
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERVICE_ACCOUNT_PATH = os.path.join(BASE_DIR, "serviceAccountKey.json")

# ✅ 파일 유효성 검증
if not os.path.exists(SERVICE_ACCOUNT_PATH):
    raise FileNotFoundError(f"❌ Firebase 인증키 파일이 존재하지 않습니다: {SERVICE_ACCOUNT_PATH}")

# ✅ Firebase 초기화 (중복 방지)
if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)
    print("✅ Firebase Admin SDK 초기화 완료!")

# ✅ Firestore DB 연결
db = firestore.client()
