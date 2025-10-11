import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function InputBar() {
  const [input, setInput] = useState("");
  const chatId = "test-chat"; // 🔸 임시 (로그인 후 사용자별 변경 예정)

  const handleSend = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      role: "user",
      content: input,
      timestamp: serverTimestamp(),
    });

    setInput("");
  };

  return (
    <div className="input-bar">
      <input
        type="text"
        placeholder="법률 관련 질문을 입력하세요..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSend}>보내기</button>
    </div>
  );
}
