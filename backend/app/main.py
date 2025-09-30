# backend/app/main.py
from fastapi import FastAPI
from app.firebase_config import db
from datetime import datetime

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Hello Legal AI"}

@app.get("/health")
def health_check():
    return {"status": "ok", "service": "backend"}

@app.get("/test-firebase")
def test_firebase():
    test_ref = db.collection("test").document("hello")
    test_ref.set({
        "msg": "Firebase 연결 성공!",
        "time": datetime.utcnow()
    })
    return {"status": "ok"}