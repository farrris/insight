from django.http import HttpRequest
from ninja_extra import api_controller, route
from ninja_jwt.authentication import JWTAuth

from chats.serializers import ChatSerializer, MessageSerializer
from chats.service import ChatService
from chats.schemas import MessageCreate, MessageChat
from chats.models import Chat, Message
from django.db.models import Q

@api_controller("/chats/", tags=["Чат"])
class ChatController:

    def __init__(self):
        self.service = ChatService()

    @route.post("/start-chat", auth=JWTAuth())
    def start_chat(self, request: HttpRequest, message: MessageCreate):
        return self.service.start_chat(request.user, message)

    @route.get("/my", auth=JWTAuth())
    def get_chats(self, request: HttpRequest):
        chats = Chat.objects.filter(
            Q(first_user=request.user.pk) | Q(second_user=request.user.pk)
        )

        return [ChatSerializer(chat, request.user).display() for chat in chats]

    @route.get("/{int:chat_id}", auth=JWTAuth())
    def get_chat(self, request: HttpRequest, chat_id: int):
        messages = Message.objects.filter(chat_id=chat_id).order_by("sended_at")

        for message in messages:
            if (message.from_user_id != request.user.pk):
                message.is_read = True
                message.save()

        return [MessageSerializer(message).display() for message in messages]

    @route.post("/{int:chat_id}", auth=JWTAuth())
    def create_message(self, request: HttpRequest, chat_id: int, data: MessageChat):
        message = Message.objects.create(
            chat_id=chat_id,
            from_user_id=request.user.pk,
            text=data.message,
        )

        return MessageSerializer(message).display()