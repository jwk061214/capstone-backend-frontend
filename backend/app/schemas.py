from pydantic import BaseModel, EmailStr, Field, constr

class UserCreate(BaseModel):
    email: EmailStr
    password: constr(min_length=8, max_length=64) = Field(
        ...,
        description="비밀번호 (8~64자)"
    )
    name: str = Field(..., min_length=2, max_length=30)

class UserResponse(BaseModel):
    uid: str
    email: EmailStr
    name: str
