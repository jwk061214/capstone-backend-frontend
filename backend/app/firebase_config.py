import firebase_admin
from firebase_admin import credentials, firestore, auth
import os

# Firebase 서비스 계정 키 불러오기
cred = credentials.Certificate("serviceAccountKey.json")

# Firebase 초기화
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

# Firestore 클라이언트
db = firestore.client()