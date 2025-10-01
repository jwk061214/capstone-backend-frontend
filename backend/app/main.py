from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, admin, chats

app = FastAPI(title="Capstone Backend")

# ✅ CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 프론트엔드 주소
    allow_credentials=True,
    allow_methods=["*"],  # OPTIONS 포함 전체 허용
    allow_headers=["*"],
)

# ✅ 라우터 등록
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(admin.router)
app.include_router(chats.router)

@app.get("/")
def root():
    return {"message": "Backend is running 🚀"}
