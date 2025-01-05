from fastapi import Query
from pydantic import Field
from fastapi_filter.contrib.sqlalchemy import Filter
from typing import Optional

from .models import User
from .enums import UserGenderEnum

class UserFilter(Filter):
    name__ilike: Optional[str] = None
    interests__in: Optional[list[str]] = None
    city: Optional[str] = None
    age__gte: Optional[int] = None
    age__lt: Optional[int] = None
    gender: Optional[UserGenderEnum] = None

    class Constants(Filter.Constants):
        model = User