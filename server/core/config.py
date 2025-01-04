import os
import time
from fastapi import FastAPI
from contextlib import asynccontextmanager

from .db import conn_health

os.environ['TZ'] = 'Europe/Moscow'
time.tzset()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await conn_health()
    yield