from sqlalchemy.ext.asyncio import AsyncSession
from .models import User, UserInterest

from sqlalchemy import delete

from core.logger import logger

async def update_user_interest(user: User, interest_ids: list[int], session: AsyncSession) -> list[UserInterest]:
    old_interest_ids = [interest.id for interest in user.interests]

    added_ids = list(set(interest_ids) - set(old_interest_ids))
    removed_ids = list(set(old_interest_ids) - set(interest_ids))

    await session.execute(
        delete(UserInterest)
        .where(UserInterest.user_id == user.id, UserInterest.interest_id.in_(removed_ids))
    )

    new_user_interests = [UserInterest(user_id=user.id, interest_id=interest_id) for interest_id in added_ids]

    session.add_all(new_user_interests)

    await session.commit()

