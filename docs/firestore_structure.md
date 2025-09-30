# 🗄️ Firestore 구조 설계

본 문서는 캡스톤 프로젝트의 Firestore 컬렉션/도큐먼트 구조를 정의합니다.  
목표는 사용자/대화/법령 데이터를 체계적으로 관리하는 것입니다.  

---

## 전체 구조
```bash
firestore-root
├── users/ (사용자 정보)
│   └── {uid}
│       ├── email: string
│       ├── name: string
│       ├── created_at: timestamp
│       └── last_login: timestamp
│
└── chats/ (대화 세션)
    └── {chat_id}
        ├── user_id: string (UID 참조)
        ├── title: string (대화 제목)
        ├── created_at: timestamp
        └── messages/ (subcollection: 대화 내역)
            └── {message_id}
                ├── role: "user" | "assistant"
                ├── content: string (본문)
                └── timestamp: timestamp
```
## users 컬렉션
- 경로: `users/{uid}`

| 필드명      | 타입       | 설명 |
|-------------|------------|------|
| email       | string     | 사용자 이메일 |
| name        | string     | 사용자 이름 |
| role        | string     | 기본값 `"user"` |
| created_at  | timestamp  | 계정 생성 시간 |
| last_login  | timestamp  | 마지막 로그인 시간 |

✅ 회원가입 시 `created_at` 저장  
✅ 로그인 성공 시 `last_login` 갱신