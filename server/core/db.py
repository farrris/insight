import os
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from contextlib import asynccontextmanager

from .logger import logger

DB_USER = os.getenv("POSTGRES_USER")
DB_PASSWORD = os.getenv("POSTGRES_PASSWORD")
DB_NAME = os.getenv("POSTGRES_DB")

DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@db:5432/{DB_NAME}"

engine = create_async_engine(DATABASE_URL)

async def conn_health():
    try:
        async with engine.connect():
            logger.debug("database connect success")
    except Exception as err:
        logger.debug("database connect failed: " + str(err))


@asynccontextmanager
async def get_session() -> AsyncGenerator[AsyncSession]:
    try:
        async_session = sessionmaker(engine, class_=AsyncSession)

        async with async_session() as session:
            yield session

    except:
        await session.rollback()
        raise

    finally:
        await session.close()
