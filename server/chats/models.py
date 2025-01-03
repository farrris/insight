from django.db import models
from users.models import User

class Chat(models.Model):

    first_user = models.ForeignKey("users.User", null=True, on_delete=models.SET_NULL, related_name="chats_as_first_user")
    second_user = models.ForeignKey("users.User", null=True, on_delete=models.SET_NULL, related_name="chats_as_second_user")

    def get_to_user(self, auth_user: User):
        if (self.first_user == auth_user):
            return self.second_user
        elif (self.second_user == auth_user):
            return self.first_user
        
    def count_unread_messages(self, auth_user: User):
        return self.messages.filter(is_read=False).exclude(from_user=auth_user).count()

    @property
    def last_message(self):
        return self.messages.latest("sended_at")

    def __str__(self) -> str:
        return self.first_user.username + " - " + self.second_user.username
    
class Message(models.Model):

    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    from_user = models.ForeignKey("users.User", null=True, on_delete=models.SET_NULL, related_name="messages")
    text = models.CharField()
    is_read = models.BooleanField(default=False)

    sended_at = models.DateTimeField(auto_now_add=True, null=True)

    def __str__(self) -> str:
        return f"{self.from_user}: {self.text}"