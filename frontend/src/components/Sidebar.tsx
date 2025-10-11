import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { Trash2, PlusCircle, Edit3, Check } from "lucide-react";
import type { ChatMeta } from "../types/chat";

interface Props {
  selectedChatId?: string | null;
  onSelect: (chatId: string | null) => void;
}

export default function Sidebar({ selectedChatId, onSelect }: Props) {
  const [chats, setChats] = useState<(ChatMeta & { preview?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  // ✅ 로그인된 사용자 UID 가져오기
  const userId = localStorage.getItem("uid");

useEffect(() => {
  const uid = localStorage.getItem("uid");

  if (!uid) {
    console.warn("⚠️ 로그인된 사용자 UID가 없습니다. 0.5초 후 재시도합니다.");
    const timer = setTimeout(() => window.location.reload(), 500);
    return () => clearTimeout(timer);
  }

  const q = query(
    collection(db, "chats"),
    where("user_id", "==", uid),
    orderBy("created_at", "desc")
  );

  const unsub = onSnapshot(q, async (snap) => {
    const data = await Promise.all(
      snap.docs.map(async (chatDoc) => {
        const chatData = chatDoc.data() as Omit<ChatMeta, "id">;
        const msgSnap = await getDocs(
          query(
            collection(db, "chats", chatDoc.id, "messages"),
            orderBy("timestamp", "desc")
          )
        );
        const preview = msgSnap.docs[0]?.data()?.content || "";
        return { id: chatDoc.id, ...chatData, preview };
      })
    );
    setChats(data);
    setLoading(false);
  });

  return () => unsub();
}, []);

  // ✅ 새 대화 생성
  const handleNewChat = async () => {
    if (!userId) return alert("로그인 상태가 아닙니다.");

    const now = new Date();
    const docRef = await addDoc(collection(db, "chats"), {
      user_id: userId,
      title: "새 대화",
      created_at: now,
    });

    // 즉시 UI 반영
    setChats((prev) => [
      {
        id: docRef.id,
        user_id: userId,
        title: "새 대화",
        created_at: now,
        preview: "",
      },
      ...prev,
    ]);

    onSelect(docRef.id);
  };

  // ✅ 제목 수정
  const handleEditTitle = async (chatId: string) => {
    if (!editTitle.trim()) return alert("제목을 입력하세요!");
    try {
      await updateDoc(doc(db, "chats", chatId), { title: editTitle });

      // 즉시 UI 갱신
      setChats((prev) =>
        prev.map((c) =>
          c.id === chatId ? { ...c, title: editTitle } : c
        )
      );
      setEditingId(null);
      setEditTitle("");
    } catch (err) {
      console.error("❌ 제목 수정 실패:", err);
    }
  };

  // ✅ 삭제 (messages 포함)
  const handleDelete = async (chatId: string) => {
    if (!window.confirm("이 대화를 완전히 삭제하시겠습니까?")) return;
    try {
      const msgs = await getDocs(collection(db, "chats", chatId, "messages"));
      for (const m of msgs.docs) {
        await deleteDoc(doc(db, "chats", chatId, "messages", m.id));
      }
      await deleteDoc(doc(db, "chats", chatId));

      // UI에서도 제거
      setChats((prev) => prev.filter((c) => c.id !== chatId));
      if (selectedChatId === chatId) onSelect(null);
    } catch (err) {
      console.error("❌ 삭제 실패:", err);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo">⚖️ Legal AI</h2>
        <button className="new-btn" onClick={handleNewChat}>
          <PlusCircle size={18} /> 새 대화
        </button>
      </div>

      <div className="chat-list">
        {loading ? (
          <p className="empty">불러오는 중...</p>
        ) : chats.length === 0 ? (
          <p className="empty">대화 없음</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-card ${
                selectedChatId === chat.id ? "active" : ""
              }`}
              onClick={() => onSelect(chat.id)}
            >
              {editingId === chat.id ? (
                <div className="chat-edit">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleEditTitle(chat.id)
                    }
                    autoFocus
                    className="edit-input"
                  />
                  <Check
                    size={16}
                    className="check-icon"
                    onClick={() => handleEditTitle(chat.id)}
                  />
                </div>
              ) : (
                <div className="chat-header">
                  <span className="chat-title">
                    {chat.title || "제목 없음"}
                  </span>
                  <div className="chat-actions">
                    <Edit3
                      size={14}
                      className="edit-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(chat.id);
                        setEditTitle(chat.title);
                      }}
                    />
                    <Trash2
                      size={15}
                      className="delete-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(chat.id);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
