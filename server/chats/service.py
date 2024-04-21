from django.db.models import Q

from chats.models import Chat, Message
from chats.schemas import MessageCreate
from chats.responses import chat_exists, chat_created
from users.models import User

import channels.layers
from asgiref.sync import async_to_sync
import json

class ChatService:

    def start_chat(self, user: User, message: MessageCreate):
        chat = Chat.objects.filter(
            Q(first_user_id=user.pk, second_user_id=message.to_user_id) | Q(first_user_id=message.to_user_id, second_user_id=user.pk)
        ).exists()

        if (chat):
            return chat_exists
        
        chat = Chat.objects.create(
            first_user_id=user.pk,
            second_user_id=message.to_user_id
        )

        message = Message.objects.create(
            chat=chat,
            from_user=user,
            text=message.message
        )

        self.send_message_to_consumer(user, message)

        return chat_created
    
    def send_message_to_consumer(self, user: User, message: Message):
        to_user = message.chat.get_to_user(auth_user=user)
        group_name = f"chats_{to_user.pk}"

        channel_layer = channels.layers.get_channel_layer()

        async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "sendMessage",
            "event": "updateChats"
        }
    )