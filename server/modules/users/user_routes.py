from fastapi import APIRouter, Form, Depends
from fastapi_filter import FilterDepends
from typing import Annotated

from core.db import get_session
from services.storage import upload_file
from .schemas import UserListRequestSchema, UserUpdateRequestSchema, AuthResponseSchema, UserAuthResponseSchema
from .jwt import create_access_token
from .dependencies import get_user_required

from .enums import UserGenderEnum

from .models import User
from .service import update_user_interest
from .filters import UserFilter

from fastapi import UploadFile, File
from sqlalchemy import select

router = APIRouter(
    tags=["users"],
    prefix="/users"
)

@router.get("/")
async def get_users(
    user_filter: UserFilter = FilterDepends(UserFilter),
) -> list[UserListRequestSchema]:
    async with get_session() as session:
        query = await session.execute(
            user_filter.filter(
                select(User)
            )
        )

        users = query.scalars().all()

        return users

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
            password=password,
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
    
@router.put("/")
async def update_user(body: UserUpdateRequestSchema, current_user: Annotated[User, Depends(get_user_required)]) -> UserAuthResponseSchema:
    async with get_session() as session:
        
        filtered_data = {key: value for key, value in body.model_dump().items() if value is not None}

        for key, value in filtered_data.items():
            if (key == "interests"):
                await update_user_interest(current_user, body.interests, session)
            else:
                setattr(current_user, key, value)
        
        session.add(current_user)
        await session.commit()
        await session.refresh(current_user)
    
    return current_user