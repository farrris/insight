from ninja import Schema
from users.schemas import UserShortOut

class MessageChat(Schema):

    message: str
class MessageCreate(Schema):

    to_user_id: int
    message: str

class MessageOut(Schema):

    from_user: UserShortOut
    chat_id: int
    text: str
    is_read: bool
    sended_at: str

class ChatOut(Schema):

    id: int
    to_user: UserShortOut
    last_message: MessageOut
    unread_count: int
