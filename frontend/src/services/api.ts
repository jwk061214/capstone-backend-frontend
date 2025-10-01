// src/services/api.ts
const API_BASE = "http://127.0.0.1:8000";

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("로그인 실패");
  }

  return res.json();
}

export async function getMe(token: string) {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("사용자 정보 불러오기 실패");
  }

  return res.json();
}
