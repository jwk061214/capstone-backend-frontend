from pydantic import BaseModel, EmailStr, Field, constr
from datetime import datetime

# ---------------------
# Auth 관련
# ---------------------
class UserCreate(BaseModel):
    email: EmailStr
    password: constr(min_length=8, max_length=64) = Field(
        ..., description="비밀번호 (8~64자)"
    )
    name: str = Field(..., min_length=2, max_length=30)


class UserResponse(BaseModel):
    uid: str
    email: EmailStr
    name: str
    role: str | None = "user"


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    

# ---------------------
# Chats 관련
# ---------------------
class ChatCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)


class ChatResponse(BaseModel):
    chat_id: str
    user_id: str
    title: str
    created_at: datetime


class MessageCreate(BaseModel):
    role: str = Field(..., pattern="^(user|assistant)$")
    content: str = Field(..., min_length=1)


class MessageResponse(BaseModel):
    message_id: str
    role: str
    content: str
    timestamp: datetime
