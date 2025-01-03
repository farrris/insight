import "./index.css";
import NavBar from "../../components/navbar";
import Container from 'react-bootstrap/Container';
import { useEffect, useState} from "react";
import useWebSocket, { ReadyState } from "react-use-websocket"
import { Form } from "react-bootstrap";
import sendImg from "../../assets/send.png"
import { Image } from "react-bootstrap";

function Chat({chat}) {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = localStorage.getItem("access");
    const WS_URL = "ws://127.0.0.1:8000/ws/chat/" + chat.id + "?auth_token=" + accessToken;
    const socket = new WebSocket(WS_URL);

    const timeFormat = (fullDateString) => {
        return fullDateString.slice(11, 16);
    }

    const wsSend = (data) => {
        if(!socket.readyState){
            setTimeout(() => {
                wsSend(data);
            }, 100);
        } else{
            socket.send(data);
        }
    };

    const sendMessage = (message) => {
        let input =  document.getElementsByClassName("send-message-input")[0];
        let stringData = JSON.stringify({message: input.value});
        wsSend(stringData);
        input.value = "";
    }

    useEffect(() => {
        socket.onmessage = function(event) {
            let jsonData = JSON.parse(event.data);
            if (jsonData.message) {
                setMessages(messages => [...messages, jsonData.message]);
            }
        };
    }, [])
    
    return (
        <div>
            <div className="full-chat">
                {messages.map((message) => (
                    message.from_user.id == user.id ? 
                        <div className="message-my-card-block d-flex justify-content-end" key={message.id}>
                            <p className="message-my-card">{message.text}</p>
                            <p>{timeFormat(message.sended_at)}</p>
                        </div>
                     :
                        <div className="message-user-card-block d-flex justify-content-start" key={message.id}>
                            <p className="message-user-card">{message.text}</p>
                            <p>{timeFormat(message.sended_at)}</p>
                        </div>
                    
                ))}
            </div>
            <div className="d-flex">
                <Form.Control type="text" className="send-message-input custom-form-input" placeholder="Написать" onKeyDown={event => {if (event.key == "Enter") sendMessage(message)}} />
                <Image onClick={() => sendMessage(message)} style={{marginTop: "30px", marginLeft: "20px"}} src={sendImg} width={50} height={50}/>
            </div>
        </div>
    )
}

export default Chat;