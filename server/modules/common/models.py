from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import String, Boolean

from core.db import Base

class Interest(Base):

    IS_ACTIVE = True
    NOT_ACTIVE = False

    __tablename__ = "interests"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(128))
    is_active: Mapped[bool] = mapped_column(Boolean, default=IS_ACTIVE)

    def __repr__(self) -> str:
        return self.title
