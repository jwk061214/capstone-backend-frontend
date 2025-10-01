from fastapi import APIRouter, Depends, HTTPException
from app.utils.deps import get_current_user
from app.firebase_config import db
from datetime import datetime
import uuid

from app.schemas import ChatCreate, ChatResponse, MessageCreate, MessageResponse

router = APIRouter(prefix="/chats", tags=["Chats"])

# ---------------------
# 대화 생성
# ---------------------
@router.post("/", response_model=ChatResponse)
def create_chat(request: ChatCreate, user=Depends(get_current_user)):
    chat_id = str(uuid.uuid4())
    db.collection("chats").document(chat_id).set({
        "user_id": user["uid"],
        "title": request.title,
        "created_at": datetime.utcnow()
    })
    return ChatResponse(
        chat_id=chat_id,
        user_id=user["uid"],
        title=request.title,
        created_at=datetime.utcnow()
    )

# ---------------------
# 내 대화 목록 조회
# ---------------------
@router.get("/", response_model=list[ChatResponse])
def get_my_chats(user=Depends(get_current_user)):
    chats = db.collection("chats").where("user_id", "==", user["uid"]).stream()
    return [
        ChatResponse(
            chat_id=chat.id,
            user_id=chat.to_dict()["user_id"],
            title=chat.to_dict()["title"],
            created_at=chat.to_dict()["created_at"],
        )
        for chat in chats
    ]

# ---------------------
# 특정 대화 메시지 조회
# ---------------------
@router.get("/{chat_id}/messages", response_model=list[MessageResponse])
def get_messages(chat_id: str, user=Depends(get_current_user)):
    chat_ref = db.collection("chats").document(chat_id).get()
    if not chat_ref.exists or chat_ref.to_dict()["user_id"] != user["uid"]:
        raise HTTPException(status_code=403, detail="권한이 없습니다")

    messages = (
        db.collection("chats")
        .document(chat_id)
        .collection("messages")
        .order_by("timestamp")
        .stream()
    )
    return [
        MessageResponse(
            message_id=msg.id,
            role=msg.to_dict()["role"],
            content=msg.to_dict()["content"],
            timestamp=msg.to_dict()["timestamp"]
        )
        for msg in messages
    ]

# ---------------------
# 메시지 추가
# ---------------------
@router.post("/{chat_id}/messages", response_model=MessageResponse)
def add_message(chat_id: str, message: MessageCreate, user=Depends(get_current_user)):
    chat_ref = db.collection("chats").document(chat_id).get()
    if not chat_ref.exists or chat_ref.to_dict()["user_id"] != user["uid"]:
        raise HTTPException(status_code=403, detail="권한이 없습니다")

    message_id = str(uuid.uuid4())
    msg_ref = (
        db.collection("chats")
        .document(chat_id)
        .collection("messages")
        .document(message_id)
    )
    msg_ref.set({
        "role": message.role,
        "content": message.content,
        "timestamp": datetime.utcnow()
    })

    return MessageResponse(
        message_id=message_id,
        role=message.role,
        content=message.content,
        timestamp=datetime.utcnow()
    )

# ---------------------
# 대화 삭제
# ---------------------
@router.delete("/{chat_id}")
def delete_chat(chat_id: str, user=Depends(get_current_user)):
    chat_doc = db.collection("chats").document(chat_id).get()
    if not chat_doc.exists:
        raise HTTPException(status_code=404, detail="채팅방을 찾을 수 없습니다")

    if chat_doc.to_dict().get("user_id") != user["uid"]:
        raise HTTPException(status_code=403, detail="권한이 없습니다")

    # messages 전체 삭제
    messages_ref = db.collection("chats").document(chat_id).collection("messages").stream()
    for msg in messages_ref:
        msg.reference.delete()

    # chat 삭제
    db.collection("chats").document(chat_id).delete()

    return {"detail": "채팅방이 삭제되었습니다."}
