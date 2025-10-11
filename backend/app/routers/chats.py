from fastapi import APIRouter, Depends, HTTPException
from app.utils.deps import get_current_user
from app.firebase_config import db
from datetime import datetime, timezone
import uuid
from pydantic import BaseModel
from app.schemas import ChatCreate, ChatResponse, MessageCreate, MessageResponse

router = APIRouter(prefix="/chats", tags=["Chats"])

# ---------------------
# 🟢 대화 생성
# ---------------------
@router.post("/", response_model=ChatResponse)
def create_chat(request: ChatCreate, user=Depends(get_current_user)):
    """
    새 대화 생성
    - 로그인한 사용자의 UID로 Firestore에 대화 문서 생성
    """
    try:
        chat_id = str(uuid.uuid4())
        created_at = datetime.now(timezone.utc)

        user_uid = user.get("uid")
        if not user_uid:
            raise HTTPException(status_code=401, detail="로그인 정보가 없습니다")

        db.collection("chats").document(chat_id).set({
            "user_id": user_uid,
            "title": request.title or "새 대화",
            "created_at": created_at
        })

        return ChatResponse(
            chat_id=chat_id,
            user_id=user_uid,
            title=request.title or "새 대화",
            created_at=created_at
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"대화 생성 실패: {str(e)}")


# ---------------------
# 🟡 내 대화 목록 조회
# ---------------------
@router.get("/", response_model=list[ChatResponse])
def get_my_chats(user=Depends(get_current_user)):
    """
    로그인한 사용자의 모든 대화 목록 반환 (최신순)
    """
    try:
        user_uid = user.get("uid")
        if not user_uid:
            raise HTTPException(status_code=401, detail="로그인 정보가 없습니다")

        # Firestore 쿼리: user_id 조건 + 최신순 정렬
        chats_query = (
            db.collection("chats")
            .where("user_id", "==", user_uid)
            .order_by("created_at", direction="DESCENDING")
        )

        chats_ref = chats_query.stream()
        chats = []
        for chat in chats_ref:
            chat_data = chat.to_dict()
            chats.append(ChatResponse(
                chat_id=chat.id,
                user_id=chat_data.get("user_id"),
                title=chat_data.get("title"),
                created_at=chat_data.get("created_at")
            ))
        return chats

    except Exception as e:
        # Firestore 복합 인덱스 필요 시 에러 발생 → 안내 메시지로 대체
        if "index" in str(e).lower():
            raise HTTPException(
                status_code=400,
                detail="Firestore 인덱스가 필요합니다. 콘솔에서 생성 후 다시 시도하세요."
            )
        raise HTTPException(status_code=500, detail=f"대화 목록 조회 실패: {str(e)}")


# ---------------------
# 🟢 특정 대화의 메시지 조회
# ---------------------
@router.get("/{chat_id}/messages", response_model=list[MessageResponse])
def get_messages(chat_id: str, user=Depends(get_current_user)):
    """
    특정 대화의 전체 메시지를 시간순으로 조회
    """
    chat_doc = db.collection("chats").document(chat_id).get()
    if not chat_doc.exists:
        raise HTTPException(status_code=404, detail="채팅방을 찾을 수 없습니다")

    chat_data = chat_doc.to_dict()
    if chat_data.get("user_id") != user["uid"]:
        raise HTTPException(status_code=403, detail="권한이 없습니다")

    messages_ref = (
        db.collection("chats")
        .document(chat_id)
        .collection("messages")
        .order_by("timestamp")
        .stream()
    )

    return [
        MessageResponse(
            message_id=msg.id,
            role=msg_data.get("role"),
            content=msg_data.get("content"),
            timestamp=msg_data.get("timestamp"),
        )
        for msg in messages_ref
        if (msg_data := msg.to_dict())
    ]


# ---------------------
# 🟢 메시지 추가
# ---------------------
@router.post("/{chat_id}/messages", response_model=MessageResponse)
def add_message(chat_id: str, message: MessageCreate, user=Depends(get_current_user)):
    """
    사용자의 메시지를 해당 대화에 추가
    """
    chat_doc = db.collection("chats").document(chat_id).get()
    if not chat_doc.exists:
        raise HTTPException(status_code=404, detail="채팅방을 찾을 수 없습니다")

    chat_data = chat_doc.to_dict()
    if chat_data.get("user_id") != user["uid"]:
        raise HTTPException(status_code=403, detail="권한이 없습니다")

    message_id = str(uuid.uuid4())
    timestamp = datetime.now(timezone.utc)

    db.collection("chats").document(chat_id).collection("messages").document(message_id).set({
        "role": message.role,
        "content": message.content,
        "timestamp": timestamp
    })

    return MessageResponse(
        message_id=message_id,
        role=message.role,
        content=message.content,
        timestamp=timestamp
    )


# ---------------------
# 🔴 대화 삭제
# ---------------------
@router.delete("/{chat_id}")
def delete_chat(chat_id: str, user=Depends(get_current_user)):
    """
    특정 대화 및 모든 메시지 완전 삭제
    """
    chat_doc = db.collection("chats").document(chat_id).get()
    if not chat_doc.exists:
        raise HTTPException(status_code=404, detail="채팅방을 찾을 수 없습니다")

    chat_data = chat_doc.to_dict()
    if chat_data.get("user_id") != user["uid"]:
        raise HTTPException(status_code=403, detail="권한이 없습니다")

    # messages 전체 삭제
    messages_ref = db.collection("chats").document(chat_id).collection("messages").stream()
    for msg in messages_ref:
        msg.reference.delete()

    # chat 문서 삭제
    db.collection("chats").document(chat_id).delete()
    return {"detail": "채팅방이 삭제되었습니다."}


# ---------------------
# 🤖 AI 응답 (임시 버전)
# ---------------------
class ChatRequest(BaseModel):
    chat_id: str
    user_message: str


@router.post("/ai_reply")
def ai_reply(req: ChatRequest):
    """
    프론트엔드에서 사용자의 질문을 전송하면
    LLM (예: GPT, Gemini) 응답을 반환하는 엔드포인트
    """
    return {
        "reply": f"'{req.user_message}' 이슈는 관련 법령·절차로 검토할 수 있습니다.",
        "timestamp": datetime.now(timezone.utc)
    }
