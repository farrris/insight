from fastapi import APIRouter

from common.routes import router as common_router

router = APIRouter()

router.include_router(common_router)