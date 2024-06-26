"""
ASGI config for core project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from django.urls import path

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application

from chats.consumers.chat import ChatConsumer
from chats.consumers.chats import ChatsConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter([
                path('ws/chat/<chat_id>', ChatConsumer.as_asgi()),
                path('ws/<user_id>/chats', ChatsConsumer.as_asgi())
            ])
        )
    }
)