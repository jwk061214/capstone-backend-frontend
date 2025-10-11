export type Role = "user" | "assistant";

export interface ChatMeta {
  id: string;
  user_id: string;
  title: string;
  created_at?: any; // Firestore Timestamp
}

export interface Message {
  id?: string;
  role: Role;
  content: string;
  timestamp?: any;
}
