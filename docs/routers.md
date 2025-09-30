# Router 구조
라우터 구조 & 모듈 설명
## Auth Router
- 경로: `/auth`
- 포함 API:
  - `POST /register` → 회원가입
  - (추가 예정: `/login`, `/logout` 등)

## Main Router
- 루트 엔드포인트 (`/`, `/health`)
- Firebase 테스트 `/test-firebase`
- Auth Router 포함