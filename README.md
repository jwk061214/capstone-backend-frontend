# Capstone Project: Legal AI (Backend & Frontend)

## 📖 프로젝트 개요
외국인을 위한 한국 법률 도우미 AI 서비스를 개발하는 캡스톤 디자인 프로젝트입니다.  
백엔드(FastAPI)와 프론트엔드(Next.js, Firebase)를 통합하여 **법률 상담 챗봇**을 구현합니다.

---

## ⚙️ 기술 스택
- **Backend**: FastAPI, Uvicorn, Firebase Admin SDK, OpenAI API
- **Frontend**: Next.js (React), Tailwind CSS, Firebase Auth/Firestore
- **Infra & Tools**: GitHub, GitHub Actions, Vercel/Render

---

## 📂 디렉토리 구조
capstone-backend-frontend/
├── backend/ # FastAPI 서버
├── frontend/ # Next.js 프론트엔드
└── docs/ # 문서 및 다이어그램



---

## 🚀 실행 방법

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
API 문서: http://127.0.0.1:8000/docs
```

Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
웹앱: http://localhost:3000
```
