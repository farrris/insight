from fastapi import APIRouter

from modules.common.routes import router as common_router
from modules.users.user_routes import router as users_router
from modules.users.auth_routes import router as auth_router

router = APIRouter(
    prefix="/api"
)

router.include_router(common_router)
router.include_router(users_router)
router.include_router(auth_router)