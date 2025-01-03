import "./index.css"
import { useLocation, useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import defaultAvatar from "../../assets/default-avatar.png";
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from "axios";
import { API_URL } from "../../constants";
import Form from 'react-bootstrap/Form';

function PeopleCard({people, renderFavorites}) {
    const [modalShow, setModalShow] = useState(false);
    const [modalWriteShow, setModalWriteShow] = useState(false);
    const [isFavorite, setIsFavorite] = useState(people.is_favorite);
    const [message, setMessage] = useState("");

    const location = useLocation();

    const navigate = useNavigate();

    const sendMessage = () => {
        const fullUrl = API_URL + "/api/chats/start-chat";
        const startChatData = {
            to_user_id: people.id,
            message: message
        }

        axios.post(fullUrl, startChatData).then((res) => {
            navigate("/chats");
        }).catch((err) => {
            console.log(err);
        });
    }

    const removeFavorite = () => {
        const fullUrl = API_URL + "/api/favorites/" + people.id;
        axios.delete(fullUrl).then((res) => {
            setIsFavorite(false);
            if (location.pathname == "/favorites") {
                setModalShow(false);
                renderFavorites();
            }
        }).catch((res) => console.log(res));
    }

    const addFavorite = () => {
        const fullUrl = API_URL + "/api/favorites/?user_id=" + people.id;
        axios.post(fullUrl).then((res) => setIsFavorite(true))
                            .catch((res) => console.log(res));
    }

    useEffect(() => {
        
    }, [isFavorite])

    return (
        <div>
            <div className="people-card" onClick={() => setModalShow(true)}>
                <div className="base-info-block d-flex justify-content-start">
                    { people.avatar ? <Image src={API_URL + people.avatar} width={150} height={150} /> : <Image src={defaultAvatar} /> }
                    <div className="base-info-block-text">
                        <p>{people.name} {people.surname}</p>
                        <p>Город: {people.city}</p>
                        <p>Возраст: {people.age}</p>
                    </div>
                </div>
                <p className="people-card-about">
                    {people.about}
                </p>
                <div className="d-flex">
                    {people.interests.map((interest) => (
                        <div className="interest">{interest.title}</div>
                    ))}
                </div>
            </div>

            <Modal
                className="modal-details"
                size="lg"
                show={modalShow}
                onHide={() => setModalShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                    <div className="modal-details-body">
                        <div className="d-flex justify-content-between mt-3">
                            {isFavorite ? <div style={{color: "#3f7dfc", fontSize: "24px"}} onClick={removeFavorite}>Убрать из избранного</div> : <div style={{color: "#3f7dfc", fontSize: "24px"}} onClick={addFavorite}>Добавить в избранное</div> }
                            <div style={{color: "#3f7dfc", fontSize: "24px"}} onClick={() => { setModalShow(false); setModalWriteShow(true)}}>Написать</div>
                        </div>  
                        <div className="d-flex justify-content-between mt-5">
                            <div className="d-flex">
                                { people.avatar ? <Image src={API_URL + people.avatar} width={200} height={200} /> : <Image src={defaultAvatar} /> }
                                <div style={{marginLeft: "15%", fontSize: "20px"}}>
                                    <p>{people.name}</p>
                                    <p>{people.surname}</p>
                                </div>
                            </div>
                            <div style={{fontSize: "20px"}}>
                                <p>Пол: {people.gender}</p>
                                <p>Город: {people.city}</p>
                                <p>Возраст: {people.age}</p>
                            </div>
                        </div>  
                        <p style={{fontSize: "18px"}} className="mt-5">{people.about}</p>
                        <div className="d-flex mb-5">
                            {people.interests.map((interest) => (
                                <div className="interest">{interest.title}</div>
                            ))}
                        </div>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                className="modal-details"
                size="lg"
                show={modalWriteShow}
                onHide={() => setModalWriteShow(false)}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>Написать {people.name} {people.surname}</Modal.Header>
                <Modal.Body>
                    <Form.Control as="textarea" rows={5} style={{border: "1px solid #000"}} defaultValue={message} onChange={(e) => setMessage(e.target.value)}/>
                    <Button className="custom-form-button mt-5" type="submit" onClick={sendMessage}>Отправить</Button>
                </Modal.Body>
            </Modal>
        </div>
    ); 
}

export default PeopleCard;