# 📌 Schemas 정의

회원가입과 로그인 요청/응답에서 사용하는 데이터 모델입니다.  
`pydantic` 기반으로 타입 검증과 자동 문서화를 지원합니다.

---

## 🔹 UserCreate
| 필드명    | 타입      | 설명                     |
|-----------|-----------|--------------------------|
| email     | EmailStr  | 사용자 이메일, 유효성 검증 포함 |
| password  | str (8~64)| 비밀번호, 최소 8자, 최대 64자 |
| name      | str (2~30)| 사용자 이름, 최소 2자, 최대 30자 |

---

## 🔹 UserResponse
| 필드명 | 타입     | 설명 |
|--------|----------|------|
| uid    | str      | Firebase Auth에서 생성된 고유 ID |
| email  | EmailStr | 사용자 이메일 |
| name   | str      | 사용자 이름 |

UserResponse 이미 정의됨 → /users/me에서도 같은 스키마 사용.
---

## 🔹 LoginRequest
| 필드명   | 타입     | 설명 |
|----------|----------|------|
| email    | EmailStr | 사용자 이메일 |
| password | str      | 사용자 비밀번호 |

---

## 🔹 LoginResponse
| 필드명       | 타입 | 설명 |
|--------------|------|------|
| access_token | str  | Firebase에서 발급한 JWT |
| token_type   | str  | 토큰 유형 (bearer) |
| expires_in   | int  | 토큰 만료 시간 (초 단위) |

---

## 🔹 Chat
| 필드명     | 타입      | 설명 |
|------------|-----------|------|
| chat_id    | string    | 대화방 고유 ID |
| user_id    | string    | 사용자 UID |
| title      | string    | 대화방 제목 |
| created_at | timestamp | 생성 시간 |

---

## 🔹 Message
| 필드명     | 타입      | 설명 |
|------------|-----------|------|
| message_id | string    | 메시지 고유 ID |
| role       | string    | 발화자 (`user`/`assistant`) |
| content    | string    | 메시지 본문 |
| timestamp  | timestamp | 생성 시간 |