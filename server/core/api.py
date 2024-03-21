from ninja_extra import NinjaExtraAPI
from ninja_jwt.controller import NinjaJWTDefaultController

from users.controller import UserController

api = NinjaExtraAPI(
    title="Insight Backend",
    version="1.0.0"
)

api.register_controllers(NinjaJWTDefaultController)
api.register_controllers(UserController)