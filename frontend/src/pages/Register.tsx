import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/auth/register", {
        email,
        password,
        name,
      });

      setMessage(`✅ 회원가입 성공! 환영합니다 ${res.data.name}님`);
      console.log("회원가입 성공:", res.data);

      // 자동 로그인 화면 이동
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      console.error("회원가입 오류:", err);

      if (err.response) {
        setMessage(`❌ 실패: ${err.response.data.detail || "서버 오류"}`);
      } else {
        setMessage("❌ 네트워크 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>회원가입</h1>
        <form onSubmit={handleRegister} style={styles.form}>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="비밀번호 (8자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: loading ? "#6c757d" : "#28a745",
              cursor: loading ? "not-allowed" : "pointer",
            }}
            disabled={loading}
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        {message && (
          <p
            style={{
              ...styles.message,
              color: message.startsWith("✅") ? "#00e676" : "#ff6b6b",
            }}
          >
            {message}
          </p>
        )}

        <p style={styles.link}>
          이미 계정이 있으신가요?{" "}
          <a onClick={() => navigate("/login")} style={{ cursor: "pointer", color: "#61dafb" }}>
            로그인하기
          </a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "linear-gradient(145deg, #0e0e10 0%, #1a1a1d 100%)",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "12px",
    padding: "40px",
    width: "360px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: "1.8rem",
    color: "#fff",
    marginBottom: "1.5rem",
    textAlign: "center" as const,
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "14px",
  },
  input: {
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "6px",
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    outline: "none",
  },
  button: {
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    color: "white",
    fontWeight: 600,
    fontSize: "1rem",
    transition: "background-color 0.3s ease",
  },
  message: {
    marginTop: "1.2rem",
    textAlign: "center" as const,
    fontWeight: 500,
  },
  link: {
    marginTop: "1.2rem",
    textAlign: "center" as const,
    color: "#aaa",
  },
};
