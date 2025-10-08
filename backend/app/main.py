# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, users, admin, chats

# ✅ FastAPI 인스턴스 생성
app = FastAPI(
    title="Legal AI Backend",
    description=(
        "💼 Hallym Univ. Capstone Project: "
        "외국인 근로자를 위한 법률 도우미 AI 서비스 백엔드.\n\n"
        "주요 기능: 회원가입, 로그인, 권한 관리, 채팅 기록, 관리자 대시보드."
    ),
    version="1.0.0",
)


# ✅ CORS 설정 (로컬 + 배포환경 모두 대응)
origins = [
    "http://localhost:5173",  # React 개발 환경
    "https://legal-ai.vercel.app",  # 배포 시 프론트엔드 주소 (예시)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # Authorization, Content-Type 등 허용
)


# ✅ 라우터 등록 (모듈별 구조화)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(admin.router)
app.include_router(chats.router)


# ✅ 헬스체크 및 기본 라우트
@app.get("/", tags=["System"])
def root():
    """
    💡 서버 상태 확인용 기본 엔드포인트
    - 배포 및 연결 테스트 시 사용
    - 응답: {"message": "...", "status": "ok"}
    """
    return {"message": "Legal AI Backend is running 🚀", "status": "ok"}


@app.get("/health", tags=["System"])
def health_check():
    """
    🩺 서버 헬스체크 엔드포인트
    - CI/CD 또는 모니터링 툴에서 주기적으로 호출
    """
    return {"status": "healthy", "uptime": "running"}
