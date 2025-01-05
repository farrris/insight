from fastapi import APIRouter, Form
from typing import List

from core.db import get_session
from services.storage import upload_file
from .schemas import UserUpdateRequestSchema, AuthResponseSchema, UserAuthResponseSchema
from .jwt import get_password_hash, create_access_token

from .enums import UserGenderEnum

from .models import User, UserInterest

from fastapi import UploadFile, File

router = APIRouter(
    tags=["users"],
    prefix="/users"
)

@router.post("/")
async def create_user(username: str = Form(...), 
                      password: str = Form(...), 
                      name: str = Form(...),
                      surname: str = Form(...),
                      city: str = Form(...),
                      age: int = Form(...), 
                      gender: UserGenderEnum = Form(...),
                      about: str = Form(None),
                      avatar: UploadFile = File(None)) -> AuthResponseSchema:

    async with get_session() as session:
        user = User(
            username=username,
            password=get_password_hash(password),
            name=name,
            surname=surname,
            city=city,
            age=age,
            gender=gender,
            avatar=upload_file(avatar),
            about=about
        )

        session.add(user)
        await session.commit()
        await session.refresh(user)

    return AuthResponseSchema(
        access=create_access_token(user),
        user=UserAuthResponseSchema.model_validate(user)
    )
    
