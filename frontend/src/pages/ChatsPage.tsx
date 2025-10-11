import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { db } from "../firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import "../styles/chat.css";

export default function ChatsPage() {
  const auth = useContext(AuthContext);
  const uid = auth?.user?.uid || ""; // ProtectedRoute 뒤라면 uid 존재

  const [selectedChatId, setSelectedChatId] = useState<string | null>(
    localStorage.getItem("selectedChatId")
  );

  // 선택 변화 저장 (새로고침 유지)
  useEffect(() => {
    if (selectedChatId) localStorage.setItem("selectedChatId", selectedChatId);
  }, [selectedChatId]);

  // 새 대화 생성: {uid}-{timestamp} 포맷 + 메타데이터
  const handleCreateChat = async () => {
    if (!uid) return;
    const newId = `${uid}-${Date.now()}`;
    const ref = doc(db, "chats", newId);
    await setDoc(ref, {
      user_id: uid,
      title: "새 대화",
      created_at: serverTimestamp(),
    });
    setSelectedChatId(newId);
  };

  // 앱 첫 진입 시 선택된 채팅 없으면 하나 생성 (선택사항)
  useEffect(() => {
    if (!uid) return;
    if (!selectedChatId) {
      // 자동 생성이 부담스러우면 주석 처리 가능
      // handleCreateChat();
    }
  }, [uid]);

  return (
    <div className="chat-layout">
      <Sidebar
        userId={uid}
        selectedChatId={selectedChatId}
        onSelect={setSelectedChatId}
        onCreate={handleCreateChat}
      />
      <div className="chat-main">
        <header className="chat-header">
          <h2>⚖️ Legal AI 상담</h2>
          <div className="user-info">
            {auth?.user ? `${auth.user.name} (${auth.user.role})` : "게스트"}
          </div>
        </header>

        <ChatWindow chatId={selectedChatId} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    background: "#0e0e10",
    color: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
  },
  body: {
    flex: 1,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutBtn: {
    background: "transparent",
    border: "1px solid #61dafb",
    borderRadius: "8px",
    padding: "6px 12px",
    color: "#61dafb",
    cursor: "pointer",
  },
};
