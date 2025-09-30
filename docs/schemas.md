# Schemas (데이터 검증 규칙)

요청/응답 스키마 정리
## UserCreate
```json
{
  "email": "user@example.com",  // 이메일 형식 검증
  "password": "StrongPass!123", // 최소 8자, 최대 64자
  "name": "홍길동"              // 최소 2자, 최대 30자
}
```
## UserResponse
```json

{
  "uid": "auto-generated",
  "email": "user@example.com",
  "name": "홍길동"
}
```