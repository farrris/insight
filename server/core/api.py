from ninja_extra import NinjaExtraAPI
from ninja_jwt.controller import NinjaJWTDefaultController

from interests.controller import InterestController
from users.controller import UserController
from favorites.controller import FavoriteController
from chats.controller import ChatController

api = NinjaExtraAPI(
    title="Insight Backend",
    version="1.0.0"
)

api.register_controllers(InterestController)
api.register_controllers(NinjaJWTDefaultController)
api.register_controllers(UserController)
api.register_controllers(FavoriteController)
api.register_controllers(ChatController)