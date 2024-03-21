from ninja import Schema
from typing import Optional

from users.enums import UserGenderEnum, FamilyStatusEnum
from interests.schemas import InterestOut

class CreateUserData(Schema):
    username: str
    password: str

    name: str
    surname: str    
    city: str
    age: int
    gender: UserGenderEnum
    family_status: FamilyStatusEnum

    interests: list[int]

class UpdateUserData(Schema):
    username: Optional[str] = None

    name: Optional[str] = None
    surname: Optional[str] = None    
    city: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[UserGenderEnum]
    family_status: Optional[FamilyStatusEnum]

    interests: list[int]

class UserOut(Schema):
    id: int
    username: str
    name: str
    surname: str
    city: str
    age: int
    gender: UserGenderEnum
    family_status: FamilyStatusEnum
    interests: list[InterestOut]
    registered_at: str
