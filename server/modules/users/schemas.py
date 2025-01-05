from pydantic import BaseModel
from .enums import UserGenderEnum
from modules.common.schemas import InterestResponseSchema

class UserUpdateRequestSchema(BaseModel):
    username: str
    password: str

    name: str
    surname: str    
    city: str
    age: int
    gender: UserGenderEnum
    about: str

    interests: list[int]

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