from django.http import HttpRequest
from ninja import Query
from ninja_extra import api_controller, route
from ninja_jwt.authentication import JWTAuth
from users.service import UserService
from users.schemas import UserOut, CreateUserData, UpdateUserData
from users.serializer import UserSerializer
from users.filters import UserFilter

@api_controller("/users/", tags=["Пользователи"])
class UserController:
    def __init__(self) -> None:
        self.service = UserService()
    
    @route.get("/", response={200:list[UserOut]})
    def get_users_list(self, filters: UserFilter = Query(...)):
        users = filters.filter(self.service.get_users_list())
        return [UserSerializer(user).display() for user in users]

    
    @route.post("/", response={200:UserOut})
    def create_user(self, data: CreateUserData):
        user = self.service.create_user(data)
        return UserSerializer(user).display()
    
    @route.put("/", auth=JWTAuth(), response={200:UserOut})
    def update_user(self, request: HttpRequest, data: UpdateUserData):
        user = self.service.update_user(request.user, data)
        return UserSerializer(user).display()
