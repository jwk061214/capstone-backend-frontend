const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * ✅ 공통 요청 헬퍼
 */
async function request(
  endpoint: string,
  options: RequestInit = {},
  useAuth = false
) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (useAuth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const detail = await safeJson(res);
    const message = detail?.detail || `요청 실패 (${res.status})`;
    throw new Error(message);
  }

  return safeJson(res);
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * 🟢 로그인 요청
 */
export async function login(email: string, password: string) {
  return request(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    false
  );
}

/**
 * 🟢 회원가입 요청
 */
export async function register(email: string, password: string, name: string) {
  return request(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
    },
    false
  );
}

/**
 * 🟢 로그인한 사용자 정보 조회
 */
export async function getMe() {
  return request("/users/me", { method: "GET" }, true);
}

/**
 * 🟢 토큰 관리 유틸
 */
export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}
