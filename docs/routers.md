# 📌 Routers 정의

현재 구현된 라우터는 Auth Router, User Router, Admin Router입니다.
---

## Auth Router
- prefix: `/auth`
- tags: ["Auth"]

### 엔드포인트 목록
1. `POST /auth/register`  
   - 회원가입 (Firebase Auth + Firestore 저장)

2. `POST /auth/login`  
   - 로그인 (Firebase REST API 사용, 토큰 반환)

## Users Router
- 경로: `/users`
- 기능:
  - `GET /users/me` : JWT 토큰 검증 후 현재 사용자 정보 반환

## Admin Router
- 경로: `/admin`
- 기능:
  - `GET /admin/users` : 전체 사용자 목록 / 관리자(role = admin)만 접근 가능
## Chats Router
- 경로: `/chats`
- 기능:
  - `POST /chats/` → 대화방 생성
  - `GET /chats/` → 내 대화방 목록 조회
  - `POST /chats/{chat_id}/messages` → 메시지 추가
  - `GET /chats/{chat_id}/messages` → 메시지 조회
  - `DELETE /chats/{chat_id}` → 대화방 삭제
