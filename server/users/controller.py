from django.http import HttpRequest
from ninja import File
from ninja.files import UploadedFile
from ninja import Query
from ninja_extra import api_controller, route
from ninja_jwt.authentication import JWTAuth
from users.service import UserService
from users.schemas import UserOut, CreateUserData, UpdateUserData, UserLoginOut
from users.serializer import UserSerializer
from users.filters import UserFilter

from ninja_jwt.tokens import RefreshToken

@api_controller("/users/", tags=["Пользователи"])
class UserController:
    def __init__(self) -> None:
        self.service = UserService()
    
    @route.get("/", response={200:list[UserOut]})
    def get_users_list(self, request: HttpRequest, filters: UserFilter = Query(...)):
        users = filters.filter(self.service.get_users_list())
        return [UserSerializer(user, request.user).display() for user in users]

    
    @route.post("/")
    def create_user(self, data: CreateUserData, avatar: UploadedFile = File(...)):
        user = self.service.create_user(data, avatar)
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserLoginOut.from_orm(user),
        }
    
    @route.put("/", auth=JWTAuth(), response={200:UserOut})
    def update_user(self, request: HttpRequest, data: UpdateUserData):
        user = self.service.update_user(request.user, data)
        return UserSerializer(user).display()
