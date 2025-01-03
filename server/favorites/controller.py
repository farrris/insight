from django.http import HttpRequest, JsonResponse
from ninja import Query
from ninja_extra import api_controller, route
from ninja_jwt.authentication import JWTAuth
from favorites.service import FavoriteService

from users.models import User
from users.schemas import UserOut
from users.serializer import UserSerializer
from users.filters import UserFilter

from favorites.responses import deleted, forbidden_favorite_self
from users.responses import user_404_not_found

@api_controller("/favorites/", tags=["Избранное"])
class FavoriteController:

    def __init__(self) -> None:
        self.service = FavoriteService()
    
    @route.get("/", auth=JWTAuth(), response={200:list[UserOut]})
    def get_favorites_list(self, request: HttpRequest, filters: UserFilter = Query(...)):
        favorites = filters.filter(self.service.get_favotires_list(request.user))
        return [UserSerializer(favorite, request.user).display() for favorite in favorites]

    @route.post("/", auth=JWTAuth(), response={200:UserOut})
    def add_favotire(self, request: HttpRequest, user_id: int):
        try:
            if (user_id == request.user.pk):
                return JsonResponse(forbidden_favorite_self, status=400)
            favorite = self.service.add_favorite(request.user, user_id)
            return UserSerializer(favorite).display()
        except User.DoesNotExist:
            return JsonResponse(user_404_not_found, status=404)
    
    @route.delete("/{int:favorite_id}", auth=JWTAuth(), response={200:str})
    def remove_favorite(self, request: HttpRequest, favorite_id:int):
        self.service.remove_favorite(request.user, favorite_id)
        return JsonResponse(deleted, status=200)