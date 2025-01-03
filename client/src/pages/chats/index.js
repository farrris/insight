import "./index.css";
import NavBar from "../../components/navbar";
import Container from 'react-bootstrap/Container';
import { useEffect, useState} from "react";
import useWebSocket, { ReadyState } from "react-use-websocket"
import ChatCard from "../../components/chat-card";
import Chat from "../../components/chat";
import checkAuth from "../../guards/auth";

function Chats() {
    checkAuth();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = localStorage.getItem("access");
    const WS_URL = 'ws://127.0.0.1:8000/ws/' + user.id + "/chats?auth_token=" + accessToken;
    const socket = new WebSocket(WS_URL);
    
    useEffect(() => {
        socket.onmessage = function(event) {
            let jsonData = JSON.parse(event.data);
            if (jsonData.chats) {
                setChats(jsonData.chats);
            }
        };
    }, [])

    return (
        <div>
            <NavBar />
            <Container className="mt-4 d-flex">
                <div>
                    {chats.map((chat) => (
                        <div key={chat.id} onClick={() => setSelectedChat(chat)}>
                            <ChatCard selectedChat={selectedChat} chat={chat} />
                        </div>
                    ))}
                </div>
                <div key={selectedChat}>
                    { selectedChat ? (
                        <Chat chat={selectedChat} />
                    ) : null }
                </div>
            </Container>
        </div>
    )
}

export default Chats;