from pydantic import BaseModel, EmailStr, Field
from typing import Annotated
class UserCreate(BaseModel):
    email: EmailStr
    password: Annotated[str, Field(min_length=8, max_length=64)]
    name: Annotated[str, Field(min_length=2, max_length=30)]


class UserResponse(BaseModel):
    uid: str
    email: EmailStr
    name: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int