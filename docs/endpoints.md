
# API Endpoints
엔드포인트(API 명세)
## 1. 기본 엔드포인트
- GET `/` → Hello Legal AI
- GET `/health` → 서버 상태 확인
- GET `/test-firebase` → Firebase 연결 테스트

## 2. 인증(Auth)
### 회원가입 (Register)
- **URL**: `POST /auth/register`
- **Request Body**
```json
{
  "email": "jwk@example.com",
  "password": "securePassword123",
  "name": "강지우"
}
```    

- **Response Body** 
```json
{
  "uid": "abc123XYZ",
  "email": "jwk@example.com",
  "name": "강지우"
}
```
- **Error Response** 
```json

{
  "detail": "이미 존재하는 이메일"
}
```
### 회원가입 (Login)
- **URL: POST /auth/login**

- **Request Body**
```json
{
  "email": "jwk@example.com",
  "password": "securePassword123"
}
```

- **Response Body** 
```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "expires_in": 3600
}

```
- **Error Response** 
```json
{
  "detail": "이메일 또는 비밀번호가 올바르지 않습니다"
}
```