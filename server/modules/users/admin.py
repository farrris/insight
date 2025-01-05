from sqladmin import ModelView
from .models import User

class UserAdmin(ModelView, model=User):
    column_list=[
        User.id,
        User.username,
        User.interests,
        User.registered_at
    ]