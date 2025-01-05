from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from .schemas import UserLoginRequestSchema, AuthResponseSchema, UserAuthResponseSchema
from core.db import get_session
from .models import User
from .jwt import verify_password, create_access_token

router = APIRouter(
    prefix="/token",
    tags=["auth"]
)

@router.post("/pair")
async def pair_token(body: UserLoginRequestSchema) -> AuthResponseSchema:
    async with get_session() as session:
        query = await session.execute(
            select(User)
            .where(User.username == body.username)
        )

        user = query.scalars().first()

        if (user and verify_password(body.password, user.password)):

            return AuthResponseSchema(
                access=create_access_token(user),
                user=UserAuthResponseSchema.model_validate(user)
            )
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )
