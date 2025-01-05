from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer
from jwt.exceptions import InvalidTokenError
from typing import Optional, Annotated
from core.db import get_session
from sqlalchemy import select
from datetime import datetime, timedelta
from .models import User
from .jwt import auth_scheme

import os
import jwt

async def get_user_required(token: Annotated[str, Depends(auth_scheme)]) -> User:    
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try: 
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        id: str = payload.get("id")
        exp: str = payload.get("exp")

        if id is None:
            raise credentials_exception
                
        if datetime.fromtimestamp(float(exp)) - datetime.now() < timedelta(0):
            raise credentials_exception

        
        async with get_session() as session:
            query = await session.execute(
                select(User)
                .where(User.id == id)
            )

            user = query.scalars().first()

            if (user is None):
                raise credentials_exception

            return user
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_user_optional(token: Annotated[str, Depends(auth_scheme)]) -> User:    
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if (not token):
        return None

    try: 
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
        id: str = payload.get("id")
        exp: str = payload.get("exp")

        if id is not None:
            raise credentials_exception
                
        if datetime.fromtimestamp(float(exp)) - datetime.now() < timedelta(0):
            raise credentials_exception

        
        async with get_session() as session:
            query = await session.execute(
                select(User)
                .where(User.id == id)
            )

            user = query.scalars().first()

            return user
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )