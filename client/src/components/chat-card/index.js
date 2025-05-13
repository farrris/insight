import "./index.css";
import { Image, Badge } from "react-bootstrap";
import defaultAvatar from "../../assets/default-avatar.png";
import { API_URL } from "../../constants";

function ChatCard({ selectedChat, chat }) {
    const timeFormat = (fullDateString) => {
        return new Date(fullDateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const isSelected = selectedChat?.id === chat.id;
    const hasUnread = chat.unread_count > 0;

    return (
        <div className={`chat-card ${isSelected ? 'selected' : ''}`}>
            <div className="chat-avatar-wrapper">
                {chat.to_user.avatar ? (
                    <Image
                        src={API_URL + chat.to_user.avatar}
                        roundedCircle
                        className="chat-avatar"
                    />
                ) : (
                    <Image
                        src={defaultAvatar}
                        roundedCircle
                        className="chat-avatar"
                    />
                )}
            </div>
            <div className="chat-info">
                <div className="d-flex justify-content-between align-items-center">
                    <h6 className="chat-user-name">
                        {chat.to_user.name} {chat.to_user.surname}
                        {hasUnread && (
                            <Badge pill bg="primary" className="unread-badge-name">
                                {chat.unread_count}
                            </Badge>
                        )}
                    </h6>
                    <small className="chat-time">
                        {timeFormat(chat.last_message.sended_at)}
                    </small>
                </div>
                <p className={`chat-preview ${hasUnread ? 'unread-message' : ''}`}>
                    {chat.last_message.text.length > 30
                        ? `${chat.last_message.text.substring(0, 30)}...`
                        : chat.last_message.text}
                </p>
            </div>
        </div>
    );
}

export default ChatCard;