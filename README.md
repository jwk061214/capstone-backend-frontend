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

- **capstone-backend-frontend/**
  - 📁 **backend/** — FastAPI 서버
    - 📁 app/ — 엔드포인트 및 비즈니스 로직
  - 📁 **frontend/** — Next.js 프론트엔드
    - 📁 src/ — 페이지 및 컴포넌트
  - 📁 **docs/** — 프로젝트 문서, 다이어그램

---

## 🚀 실행 방법

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
API 문서: http://127.0.0.1:8000/docs
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
웹앱: http://localhost:3000
```

# 📚 프로젝트 문서 모음

이 폴더는 캡스톤 프로젝트의 기술 문서를 정리한 공간입니다.  
아래 문서를 참고하세요.

---
