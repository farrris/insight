import "./index.css"
import { Image } from "react-bootstrap";
import defaultAvatar from "../../assets/default-avatar.png";
import { API_URL } from "../../constants";

function ChatCard({selectedChat, chat}) {
    const timeFormat = (fullDateString) => {
        return fullDateString.slice(11, 16);
    }
    return (
        <div className={selectedChat?.id == chat.id ? "selected-chat-card d-flex" : "chat-card d-flex"}>
            { chat.to_user.avatar ? <Image src={API_URL + chat.to_user.avatar} width={75} height={75} /> : <Image src={defaultAvatar} width={75} height={75} /> }
            <div className="chat-info">
                <p>{chat.to_user.name} {chat.to_user.surname}</p>
                <p>{chat.last_message.text} <span style={{fontSize: 10, verticalAlign: "top"}}>{timeFormat(chat.last_message.sended_at)}</span></p>
            </div>
        </div>
    )
}

export default ChatCard;