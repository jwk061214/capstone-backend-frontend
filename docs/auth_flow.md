# 인증 및 로그인 흐름 (Auth Flow)
| 단계     | 설명                                          | 관련 모듈                         |
| ------ | ------------------------------------------- | ----------------------------- |
| ① 회원가입 | Firebase Auth 계정 생성 → Firestore에 사용자 정보 저장  | `auth.py`                     |
| ② 로그인  | Firebase REST API로 로그인 요청 → JWT 발급          | `auth.py`                     |
| ③ 인증   | API 호출 시 `Authorization: Bearer <token>` 검증 | `core/security.py`, `deps.py` |
| ④ 권한   | Firestore `role` 필드 기반 (user / admin)       | `auth_utils.py`, `admin.py`   |
