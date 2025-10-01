
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

## 3. 사용자 (User API)
### `GET /users/me`
- 설명: 로그인한 사용자의 정보를 반환.
- 인증: `Authorization: Bearer <idToken>` 필요
- Response 예시:
  ```json
  {
    "uid": "abc123",
    "email": "user@example.com",
    "name": "홍길동"
  }
  ```

## 4. 관리자 (Admin API)
전체 사용자 조회 (GET /admin/users)

- URL: GET /admin/users
- 설명: Firestore users 컬렉션에서 모든 사용자 정보를 반환
- 권한: role이 "admin"인 사용자만 접근 가능

- **Request Body**
  ```json
  curl -X GET "http://127.0.0.1:8000/admin/users" \
    -H "Authorization: Bearer <ADMIN_ACCESS_TOKEN>"
  ```
- **Response Body**
  ```json
  {
    "users": [
      {
        "uid": "abc123",
        "email": "user@example.com",
        "name": "홍길동",
        "role": "user",
        "created_at": "2025-10-01T12:20:54Z",
        "last_login": "2025-10-01T12:54:15Z"
      },
      {
        "uid": "def456",
        "email": "admin@example.com",
        "name": "관리자",
        "role": "admin",
        "created_at": "2025-10-01T12:41:26Z",
        "last_login": "2025-10-01T12:59:00Z"
      }
    ]
  }
  ```
- **Error Response** 
```json
  {
    "detail": "관리자 권한이 필요합니다"
  }
```

