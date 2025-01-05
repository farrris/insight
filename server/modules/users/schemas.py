from pydantic import BaseModel
from typing import Optional
from .enums import UserGenderEnum
from modules.common.schemas import InterestResponseSchema
from datetime import datetime

class UserListRequestSchema(BaseModel):
    id: int
    avatar: str|None
    username: str
    name: str
    surname: str
    city: str
    age: int
    gender: UserGenderEnum
    about: str|None
    interests: list[InterestResponseSchema]
    registered_at: datetime

class UserUpdateRequestSchema(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None

    name: Optional[str] = None
    surname: Optional[str] = None    
    city: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[UserGenderEnum] = None
    about: Optional[str] = None

    interests: Optional[list[int]] = None

class UserLoginRequestSchema(BaseModel):
    username: str
    password: str
        
        
class UserAuthResponseSchema(BaseModel):
    id: int
    username: str
    name: str
    surname: str
    city: str
    age: int
    gender: UserGenderEnum
    about: str
    interests: list[InterestResponseSchema]

    class Config:
        from_attributes = True


class AuthResponseSchema(BaseModel):
    access: str
    user: UserAuthResponseSchema