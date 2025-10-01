# 인증 및 로그인 흐름 (Auth Flow)

1️⃣ 회원가입 → Firebase Auth 계정 생성 + Firestore 저장  
2️⃣ 로그인 → Firebase REST API 사용, JWT 발급  
3️⃣ 인증 → 모든 요청 시 `Authorization: Bearer <token>` 필요  
4️⃣ 권한 → Firestore `role` 필드 기반 (user/admin 구분)  

Admin 전용 API 접근 시 `require_role("admin")` 적용
