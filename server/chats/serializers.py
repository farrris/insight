from users.models import User

from chats.models import Message, Chat
from chats.schemas import MessageOut, ChatOut

from users.serializer import UserSerializer

class MessageSerializer:

    def __init__(self, resource: Message):
        self.resource = resource
    
    def display(self):
        return MessageOut(
            from_user=UserSerializer(self.resource.from_user).short(),
            chat_id=self.resource.chat.pk,
            text=self.resource.text,
            is_read=self.resource.is_read,
            sended_at=str(self.resource.sended_at)
        ).dict()

class ChatSerializer:

    def __init__(self, resource: Chat, user: User):
        self.resource = resource
        self.user = user
    
    def display(self):
        return ChatOut(
            id=self.resource.pk,
            to_user=UserSerializer(self.resource.get_to_user(auth_user=self.user)).short(),
            last_message=MessageSerializer(self.resource.last_message).display(),
            unread_count=self.resource.count_unread_messages(auth_user=self.user)
        ).dict()