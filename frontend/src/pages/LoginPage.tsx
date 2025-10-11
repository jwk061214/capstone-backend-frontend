import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { login, setToken, getToken } from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const hasRedirected = useRef(false); // ✅ 무한 리렌더 방지 플래그

  // ✅ 이미 로그인된 사용자는 자동 이동 (최초 한 번만)
  useEffect(() => {
    const token = getToken();
    if (token && !hasRedirected.current) {
      hasRedirected.current = true;
      // 살짝 지연시켜서 React 상태 업데이트 완료 후 이동
      setTimeout(() => navigate("/chats", { replace: true }), 100);
    }
  }, []); // ✅ 절대 navigate 넣지 말 것

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await login(email, password);

      // ✅ 토큰과 uid 저장
      setToken(data.access_token);
      if (data.uid) localStorage.setItem("uid", data.uid);

      // ✅ AuthContext 반영
      auth?.login(data.access_token);

      setMessage("✅ 로그인 성공!");
      setTimeout(() => navigate("/chats", { replace: true }), 500);
    } catch (err) {
      console.error("❌ 로그인 실패:", err);
      setMessage("❌ 이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.logo}>⚖️ Legal AI</h1>
        <p style={styles.subtitle}>외국인을 위한 스마트 법률 도우미</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <label style={styles.label}>이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            style={styles.input}
            required
          />

          <label style={styles.label}>비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            style={styles.input}
            required
          />

          <button style={styles.button} disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        {message && <p style={styles.message}>{message}</p>}

        <div style={styles.footer}>
          <span>계정이 없으신가요? </span>
          <a href="/register" style={styles.link}>
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "radial-gradient(circle at 30% 20%, #222 0%, #111 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "360px",
    background: "rgba(255, 255, 255, 0.05)",
    borderRadius: "16px",
    padding: "40px",
    boxShadow: "0 0 40px rgba(0,0,0,0.3)",
    backdropFilter: "blur(10px)",
    color: "#fff",
    textAlign: "center" as const,
    border: "1px solid rgba(255,255,255,0.1)",
  },
  logo: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "8px",
    color: "#61dafb",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.7)",
    marginBottom: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  label: {
    textAlign: "left" as const,
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.8)",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "1rem",
    outline: "none",
    transition: "border 0.3s ease",
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#61dafb",
    color: "#000",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  message: {
    marginTop: "14px",
    fontSize: "0.9rem",
    color: "#f8f8f8",
  },
  footer: {
    marginTop: "20px",
    fontSize: "0.85rem",
    color: "rgba(255,255,255,0.7)",
  },
  link: {
    color: "#61dafb",
    textDecoration: "none",
    fontWeight: "600",
  },
};
