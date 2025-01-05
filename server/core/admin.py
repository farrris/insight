from sqladmin import Admin
from sqladmin.authentication import AuthenticationBackend
from fastapi.requests import Request

from modules.users.models import User
from modules.users.jwt import verify_password, create_access_token
from core.db import get_session
from sqlalchemy import select


from .app import app
from .db import engine

# import admin models

from modules.common.admin import InterestAdmin
from modules.users.admin import UserAdmin

# configuration admin

class AdminAuth(AuthenticationBackend):
    async def login(self, request: Request) -> bool:
        form = await request.form()
        username, password = form["username"], form["password"]

        async with get_session() as session:
            query = await session.execute(
                select(User)
                .where(User.username == username)
            )

            user = query.scalars().first()

            if (user and user.is_admin == User.IS_ADMIN and verify_password(password, user.password)):
                request.session.update({"token": create_access_token(user)})

                return True
        
            return False

    async def logout(self, request: Request) -> bool:
        request.session.clear()
        return True

    async def authenticate(self, request: Request) -> bool:
        token = request.session.get("token")

        if not token:
            return False

        return True

authentication_backend = AdminAuth(secret_key="...")
admin = Admin(app, engine, authentication_backend=authentication_backend)
admin.add_view(InterestAdmin)
admin.add_view(UserAdmin)

