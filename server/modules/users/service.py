from sqlalchemy.ext.asyncio import AsyncSession
from .models import User, UserInterest

async def update_user_interest(user: User, interest_ids: list[int], session: AsyncSession) -> list[UserInterest]:
    pass

