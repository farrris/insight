import json
from channels.generic.websocket import AsyncWebsocketConsumer
from chats.models import Chat, Message
from users.models import User
from asgiref.sync import sync_to_async
from django.conf import settings
import jwt
from chats.serializers import MessageSerializer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']

        self.roomGroupName = f"chat_{self.chat_id}"
        await self.channel_layer.group_add(
            self.roomGroupName,
            self.channel_name
        )

        await self.get_auth_user()

        if (self.scope["user"].pk):
            await self.accept()
            await self.send_chat_history()
        else:
            await self.close()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.roomGroupName,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = await self.create_message(text_data_json["message"])

        to_user = message.chat.get_to_user(auth_user=self.scope['user'])
        roomGroupNameToUser = f"chats_{to_user.pk}"
        roomGroupNameFromUser = f"chats_{self.scope['user'].pk}"

        await self.channel_layer.group_send(
            self.roomGroupName, {
                "type": "sendMessage",
                "message": MessageSerializer(message).display(),
            })
        
        await self.channel_layer.group_send(
            roomGroupNameToUser, {
                "type": "sendMessage",
                "event": "updateChats"
            }
        )

        await self.channel_layer.group_send(
            roomGroupNameFromUser, {
                "type": "sendMessage",
                "event": "updateChats"
            }
        )
        

    async def sendMessage(self, event):
        message = event["message"]
        await self.send(text_data=json.dumps({"message": message}, ensure_ascii=False))

    async def send_chat_history(self):
        for message in await self.get_messages():
            await self.send(text_data=json.dumps({
                "message": MessageSerializer(message).display(),
            }, ensure_ascii=False))
    
    @sync_to_async
    def get_messages(self):
        return Message.objects.filter(chat_id=self.chat_id)

    @sync_to_async
    def get_auth_user(self):
        token = (dict((x.split('=') for x in self.scope['query_string'].decode().split("&")))).get('auth_token', None)
        token_data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"], options={"verify_signature": False})
        user = User.objects.get(id=token_data["user_id"])
        self.scope["user"] = user
    
    @sync_to_async
    def create_message(self, text: str):
        return Message.objects.create(
            chat_id=self.chat_id,
            from_user=self.scope["user"],
            text=text
        )

        