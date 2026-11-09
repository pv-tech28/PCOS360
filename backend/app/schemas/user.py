from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    full_name: str
    email: str


class UserCreate(UserBase):
    password: Optional[str] = None


class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
