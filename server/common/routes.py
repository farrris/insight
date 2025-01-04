from fastapi import APIRouter
from sqlalchemy import select
from core.db import get_session
from .models import Interest
from .schemas import InterestResponseSchema

from core.logger import logger

router = APIRouter(
    tags=["Common"],
    responses={404: {"description": "Not found"}},
)

@router.get("/interests")
async def get_interests() -> list[InterestResponseSchema]:
    async with get_session() as session:
        query = await session.execute(
            select(Interest)
            .where(Interest.is_active == Interest.IS_ACTIVE)
        )

        interests = query.scalars().all()

        return interests


