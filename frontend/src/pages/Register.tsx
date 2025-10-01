import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/register", {
        email,
        password,
        name,
      });

      setMessage(`✅ 회원가입 성공! 환영합니다 ${response.data.name}님`);
      console.log("회원가입 성공:", response.data);

    } catch (error: any) {
      console.error("회원가입 오류:", error);

      if (error.response) {
        // 백엔드에서 보낸 에러 메시지
        setMessage(`❌ 실패: ${error.response.data.detail || "서버 오류"}`);
      } else {
        // 네트워크 문제
        setMessage("❌ 네트워크 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div style={styles.container}>
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
        <button type="submit" style={styles.button}>
          회원가입
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
    backgroundColor: "#28a745",
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
