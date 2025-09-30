
# 🌐 API Endpoints
엔드포인트(API 명세)
## 1. 기본 엔드포인트
- GET `/` → Hello Legal AI
- GET `/health` → 서버 상태 확인
- GET `/test-firebase` → Firebase 연결 테스트

## 2. 인증(Auth)
### 회원가입
- POST `/auth/register`
  - Request: `UserCreate`
  - Response: `UserResponse`
  - Error Codes: 400 (중복 이메일), 500 (서버 오류)
