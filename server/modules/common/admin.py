from sqladmin import ModelView
from .models import Interest

class InterestAdmin(ModelView, model=Interest):
    column_list=[
        Interest.id,
        Interest.title,
        Interest.is_active
    ]