# ⚖️ Legal AI Backend (FastAPI + Firebase)

**외국인 근로자를 위한 법률 도우미 AI 서비스 — Backend 시스템**

이 프로젝트는 `FastAPI`와 `Firebase`를 기반으로 한 백엔드 서버로,  
회원 인증, 사용자 관리, 권한(Role) 분리, 채팅 데이터 저장을 포함한  
AI 기반 법률 상담 서비스의 핵심 인프라를 제공합니다.

---

## 🧱 주요 기능 요약

| 기능 | 설명 |
|------|------|
| 🔐 **인증 / 로그인** | Firebase Auth + Firestore 연동, JWT 토큰 기반 인증 |
| 👤 **사용자 관리** | 사용자 정보 조회 (`/users/me`), 권한(`role`) 필드 기반 관리 |
| 👑 **관리자(Admin)** | Firestore `role=admin`인 사용자만 접근 가능한 관리자 API |
| 💬 **채팅 관리 (Chats)** | 대화방 생성, 메시지 추가 및 조회 (AI 대화 저장 구조) |
| 🗄️ **데이터베이스** | Firebase Firestore — `users`, `chats`, `messages` 컬렉션 구조화 |
| 🧠 **AI 연동 (예정)** | LangChain 기반 법령 검색 + 응답 생성 (RAG Architecture) |

---


## 📂 문서 목록
- [endpoints.md](./endpoints.md) → API 엔드포인트 정리
- [schemas.md](./schemas.md) → 데이터 모델 (Pydantic Schemas)
- [firestore_structure.md](./firestore_structure.md) → Firestore 데이터 구조
- [routers.md](./routers.md) → 라우터 구조 및 역할
- [auth_flow.md](./auth_flow.md) → 인증/로그인 흐름 설명
- [chats_api.md](./chats_api.md) → Chats API 상세

## 🌐 기술 스택
| 구분           | 기술                     | 설명                    |
| ------------ | ---------------------- | --------------------- |
| **Backend**  | FastAPI                | 비동기 Python 웹 프레임워크    |
| **Database** | Firebase Firestore     | NoSQL 기반 실시간 DB       |
| **Auth**     | Firebase Auth + JWT    | 안전한 사용자 인증            |
| **Infra**    | Python-dotenv, Uvicorn | 환경변수 및 서버 실행          |
| **AI (예정)**  | LangChain, OpenAI API  | 법령 검색·요약·질의응답 RAG 시스템 |
