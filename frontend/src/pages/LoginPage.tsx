import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(`❌ 실패: ${errorData.detail || "로그인 오류"}`);
        return;
      }

      const data = await response.json();
      setMessage("✅ 로그인 성공!");
      console.log("로그인 성공:", data);

      // 토큰 저장 (ex: localStorage)
      localStorage.setItem("token", data.access_token);

    } catch (error) {
      console.error("로그인 오류:", error);
      setMessage("❌ 네트워크 오류가 발생했습니다.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>로그인</h1>
      <form onSubmit={handleLogin} style={styles.form}>
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
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>
          로그인
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    width: "300px",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  button: {
    padding: "10px",
    fontSize: "1rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  message: {
    marginTop: "1rem",
    fontSize: "1rem",
  },
};
