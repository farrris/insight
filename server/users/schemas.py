from ninja import Schema
from typing import Optional

from users.enums import UserGenderEnum
from interests.schemas import InterestOut
from ninja_jwt.schema import TokenObtainInputSchemaBase
from ninja_jwt.tokens import RefreshToken

from typing import Type, Dict

class CreateUserData(Schema):
    username: str
    password: str

    name: str
    surname: str    
    city: str
    age: int
    gender: UserGenderEnum
    about: str

    interests: list[int] = []

class UpdateUserData(Schema):
    username: Optional[str] = None

    name: Optional[str] = None
    surname: Optional[str] = None    
    city: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[UserGenderEnum] = None
    about: Optional[str] = None

    interests: list[int] = None

class UserOut(Schema):
    id: int
    avatar: str|None
    username: str
    name: str
    surname: str
    city: str
    age: int
    gender: UserGenderEnum
    about: str
    interests: list[InterestOut]
    registered_at: str
    is_favorite: bool

class UserShortOut(Schema):
    id: int
    avatar: str|None
    username: str
    name: str
    surname: str

class UserLoginOut(Schema):
    id: int
    username: str
    name: str
    surname: str
    city: str
    age: int
    gender: UserGenderEnum
    about: str
    interests: list[InterestOut]

class MyTokenObtainPairOutSchema(Schema):
    refresh: str
    access: str
    user: UserLoginOut


class MyTokenObtainPairInputSchema(TokenObtainInputSchemaBase):
    @classmethod
    def get_response_schema(cls) -> Type[Schema]:
        return MyTokenObtainPairOutSchema

    @classmethod
    def get_token(cls, user) -> Dict:
        values = {}
        refresh = RefreshToken.for_user(user)
        values["refresh"] = str(refresh)
        values["access"] = str(refresh.access_token)
        values.update(user=UserLoginOut.from_orm(user)) # this will be needed when creating output schema
        return values