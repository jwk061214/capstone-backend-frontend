# 📌 Routers 정의

현재 구현된 라우터: **Auth Router**,  **User Router**

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