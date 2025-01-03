from ninja import FilterSchema, Field
from typing import Optional, List
from users.models import User

class UserFilter(FilterSchema):
    name: Optional[str] = Field(None, q="name__contains")
    surname: Optional[str] = None
    city: Optional[str] = None
    gender: Optional[str] = None
    age_from: Optional[int] = Field(None, q="age__gte")
    age_to: Optional[int] = Field(None, q="age__lte")
    interests: List[int] = Field(None, q="interests__in")