from django.http import HttpRequest
from ninja_extra import api_controller, route
from ninja_jwt.authentication import JWTAuth

from chats.service import ChatService
from chats.schemas import MessageCreate

@api_controller("/chats/", tags=["Чат"])
class ChatController:

    def __init__(self):
        self.service = ChatService()

    @route.post("/start-chat", auth=JWTAuth())
    def start_chat(self, request: HttpRequest, message: MessageCreate):
        return self.service.start_chat(request.user, message)