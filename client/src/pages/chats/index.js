import "./index.css";
import NavBar from "../../components/navbar";
import { Container, Row, Col } from 'react-bootstrap';
import { useEffect, useState, useRef } from "react";
import ChatCard from "../../components/chat-card";
import Chat from "../../components/chat";
import checkAuth from "../../guards/auth";
import axios from "axios";
import {API_URL} from "../../constants";

function Chats() {
    checkAuth();
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = localStorage.getItem("access");

    const getChats = () => {
        axios.get(API_URL + "/api/chats/my").then((response) => {
            if (response.data) {
                setChats(response.data)
            }
        });
    }

    useEffect(() => {
        getChats();
        const interval = setInterval(() => {
            getChats();
        }, 1000);
          return () => clearInterval(interval);
    }, []);

    return (
        <div className="chats-page">
            <NavBar />
            <Container fluid className="chats-container">
                <Row className="h-100 g-0">
                    <Col md={3} className="chats-list-col">
                        <div className="chats-list-header">
                            <h3 className="text-center">Мои чаты</h3>
                        </div>
                        <div className="chats-list">
                          {chats.map((chat) => (
                            <div
                              key={`chat-${chat.id}`}
                              onClick={() => setSelectedChat(chat)}
                              className="chat-card-wrapper"
                            >
                              <ChatCard selectedChat={selectedChat} chat={chat} />
                            </div>
                          ))}
                        </div>
                    </Col>
                    <Col md={9} className="chat-window-col">
                        {selectedChat ? (
                            <Chat key={selectedChat.id} chat={selectedChat} />
                        ) : (
                            <div className="no-chat-selected">
                                <p>Выберите чат для общения</p>
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Chats;