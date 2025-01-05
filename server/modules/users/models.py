from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Boolean, Text, ForeignKey, DateTime, func, event

from core.db import Base

from datetime import datetime

from .jwt import get_password_hash

from modules.common.models import Interest

class UserInterest(Base):

    __tablename__ = "user_interest"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    interest_id: Mapped[int] = mapped_column(ForeignKey("interests.id"))

    issued_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    def __init__(self, user_id: int, interest_id: int):
        self.user_id = user_id
        self.interest_id = interest_id

    def __repr__(self) -> str:
        return f"{self.user.username} - {self.interest.title}"


class User(Base):

    IS_ADMIN = True
    NOT_ADMIN = False

    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(128))
    _password: Mapped[str] = mapped_column("password", String(256))
    avatar: Mapped[str] = mapped_column(String(256), nullable=True)

    is_admin: Mapped[bool] = mapped_column(Boolean(), default=NOT_ADMIN)

    name: Mapped[str] = mapped_column(String(32))
    surname: Mapped[str] = mapped_column(String(32))
    city: Mapped[str] = mapped_column(String(32))
    age: Mapped[int] = mapped_column(Integer())
    gender: Mapped[str] = mapped_column(String(12))
    about: Mapped[str] = mapped_column(Text(), nullable=True)

    interests: Mapped[list[Interest]] = relationship("Interest", secondary=UserInterest.__table__, backref="user", lazy="subquery")

    registered_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    def __init__(self, username: str, password: str, name: str, surname: str, city: str, age: int, gender: str, avatar: str|None, about: str|None, is_admin: bool = NOT_ADMIN):
        self.username = username
        self._password = get_password_hash(password)
        self.name = name
        self.surname = surname
        self.city = city
        self.age = age
        self.gender = gender
        self.avatar = avatar
        self.about = about
        self.is_admin = is_admin

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, password):
        self._password = get_password_hash(password)

    def __repr__(self) -> str:
        return self.username