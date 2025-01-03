import json
from channels.generic.websocket import AsyncWebsocketConsumer
from chats.models import Chat, Message
from users.models import User
from asgiref.sync import sync_to_async
from django.conf import settings
import jwt
from chats.serializers import MessageSerializer, ChatSerializer
from django.db.models import Q

class ChatsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']

        self.roomGroupName = f"chats_{self.user_id}"
        await self.channel_layer.group_add(
            self.roomGroupName,
            self.channel_name
        )

        await self.get_auth_user()

        if (self.scope["user"].pk and self.scope["user"].pk == int(self.user_id)):
            await self.accept()
            await self.send_chats()
        else:
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.roomGroupName,
            self.channel_name
        )

    async def sendMessage(self, event):
        print(event)
        if ("event" in event and event["event"] == "updateChats"):
            await self.send_chats()

    async def send_chats(self):
        chats = await self.get_chats()
        await self.send(text_data=json.dumps({
            "chats": [ChatSerializer(chat, self.scope["user"]).display() for chat in chats]
        }, ensure_ascii=False))
    
    @sync_to_async
    def get_chats(self):
        chats = Chat.objects.filter(
            Q(first_user=self.scope["user"].pk) | Q(second_user=self.scope["user"].pk)
        )

        chats = sorted(chats, reverse=True, key=lambda chat: chat.last_message.sended_at)

        return chats

    @sync_to_async
    def get_auth_user(self):
        token = (dict((x.split('=') for x in self.scope['query_string'].decode().split("&")))).get('auth_token', None)
        token_data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"], options={"verify_signature": False})
        user = User.objects.get(id=token_data["user_id"])
        self.scope["user"] = user

        