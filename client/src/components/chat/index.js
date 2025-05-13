import "./index.css";
import { Form, Image } from "react-bootstrap";
import sendImg from "../../assets/send.png";
import defaultAvatar from "../../assets/default-avatar.png";
import { useEffect, useState, useRef } from "react";
import {API_URL} from "../../constants";
import axios from "axios";

function Chat({ chat }) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);
    const reconnectAttemptRef = useRef(0);
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = localStorage.getItem("access");

    // Функция для форматирования времени
    const timeFormat = (fullDateString) => {
        return new Date(fullDateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Функция для форматирования даты
    const dateFormat = (fullDateString) => {
        const date = new Date(fullDateString);
        const today = new Date();

        if (date.toDateString() === today.toDateString()) {
            return "Сегодня"; // Не показываем дату, если сообщение сегодняшнее
        }

        return date.toLocaleDateString([], {
            day: 'numeric',
            month: 'long',
            year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const render = () => {
        axios.get(API_URL + "/api/chats/" + chat.id).then((response) => {
            if (response.data) {
                setMessages(response.data);
            }
        });
    }

    useEffect(() => {
        scrollToBottom();
        render();
        const interval = setInterval(() => {
            render();
        }, 1000);
        return () => clearInterval(interval);
    }, [chat.id, accessToken]);

    const sendMessage = (e) => {
        e?.preventDefault();
        if (!message.trim()) return;

        axios.post(API_URL + "/api/chats/" + chat.id, {
            message: message
        }).then((response) => {
            if (response.status == 200) {
                render();
                scrollToBottom();
            }
        });

        setMessage("");
    };

    // Группировка сообщений по датам
    const groupMessagesByDate = () => {
        const grouped = {};
        messages.forEach(msg => {
            const date = new Date(msg.sended_at).toDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(msg);
        });
        return grouped;
    };

    const groupedMessages = groupMessagesByDate();

    return (
        <div className="chat-container">
            <div className="chat-header">
                <div className="d-flex align-items-center">
                    {chat.to_user.avatar ? (
                        <Image src={API_URL + chat.to_user.avatar} roundedCircle className="chat-avatar" />
                    ) : (
                        <Image src={defaultAvatar} roundedCircle className="chat-avatar" />
                    )}
                    <div className="ms-3">
                        <h5>{chat.to_user.name} {chat.to_user.surname}</h5>
                    </div>
                </div>
            </div>

            <div className="messages-window">
                {messages.length > 0 ? (
                    Object.entries(groupedMessages).map(([date, msgs]) => {
                        const formattedDate = dateFormat(msgs[0].sended_at);
                        return (
                            <div key={date}>
                                {formattedDate && (
                                    <div className="message-date-divider">
                                        <span>{formattedDate}</span>
                                    </div>
                                )}
                                {msgs.map((msg) => (
                                    <div
                                        key={`msg-${msg.id}-${msg.sended_at}`}
                                        className={`message-bubble ${msg.from_user.id === user.id ? 'my-message' : 'other-message'}`}
                                    >
                                        <div className="message-content">
                                            <p className="message-text">{msg.text}</p>
                                            <span className="message-time">{timeFormat(msg.sended_at)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })
                ) : (
                    <div className="no-messages">
                        <p>Начните общение с {chat.to_user.name}</p>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <Form onSubmit={sendMessage} className="message-form">
                <Form.Group className="d-flex align-items-center">
                    <Form.Control
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={"Написать сообщение..."}
                        className="message-input"
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage(e)}
                    />
                    <button
                        type="submit"
                        className="send-button"
                        disabled={!message.trim()}
                    >
                        <Image src={sendImg} width={24} height={24} />
                    </button>
                </Form.Group>
            </Form>
        </div>
    );
}

export default Chat;