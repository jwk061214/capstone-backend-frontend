import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { db } from "../firebase";
import {
  collection, onSnapshot, orderBy, query, addDoc, serverTimestamp
} from "firebase/firestore";
import type { Message } from "../types/chat";

interface Props {
  chatId: string | null;
}

export default function ChatWindow({ chatId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // 메시지 구독
  useEffect(() => {
    if (!chatId) return;
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Message) }));
      setMessages(rows);
    });
    return () => unsub();
  }, [chatId]);

  // 자동 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!chatId || !input.trim()) return;
    const content = input.trim();

    // 1) 사용자 메시지 저장
    await addDoc(collection(db, "chats", chatId, "messages"), {
      role: "user",
      content,
      timestamp: serverTimestamp(),
    });
    setInput("");

    // 2) FastAPI 호출 → AI 응답 저장
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/chats/ai_reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ chat_id: chatId, user_message: content }),
      });
      const data = await res.json();

      await addDoc(collection(db, "chats", chatId, "messages"), {
        role: "assistant",
        content: data?.reply ?? "답변 생성에 실패했습니다.",
        timestamp: serverTimestamp(),
      });
    } catch (e) {
      console.error("AI 응답 실패:", e);
    }
  };

  // 엔터 전송 (Shift+Enter 줄바꿈)
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!chatId) {
    return (
      <div className="chat-window" style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: .7 }}>좌측에서 대화를 선택하거나 새 대화를 시작하세요.</div>
      </div>
    );
  }

  return (
    <>
      <div className="chat-window">
        {messages.map((m) => (
          <div key={m.id} className={`chat-bubble ${m.role === "user" ? "user" : "assistant"}`}>
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="input-bar">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="법률 관련 질문을 입력하세요... (Enter 전송, Shift+Enter 줄바꿈)"
          rows={1}
          style={{ resize: "none" }}
        />
        <button onClick={sendMessage}>보내기</button>
      </div>
    </>
  );
}
