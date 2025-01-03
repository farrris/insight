import NavBar from "../../components/navbar"
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { Image } from "react-bootstrap";
import registerImg1 from "../../assets/register-img-1.png"
import registerImg2 from "../../assets/register-img-2.png"
import "./index.css"
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { redirect } from "react-router-dom";
import { API_URL } from "../../constants";


function Profile() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("Мужской");
    const [city, setCity] = useState("");
    const [age, setAge] = useState(14);
    const [about, setAbout] = useState("");

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const updateUser = (event) => {
        event.preventDefault();

        let updateErrors = {};
        
        const userData = {
            email,
            username,
            name,
            surname,
            password,
            gender,
            city,
            age,
            about
        }

        for (const [key, value] of Object.entries(userData)) {
            if (value == "") {
                updateErrors[key] = "Поле обязательно для заполнения!";
            }
        }

        const fullUrl = API_URL + "/api/users/";
        if (Object.keys(updateErrors).length == 0) {
            axios.put(fullUrl, userData).then((res) => {
                navigate("/peoples");
            }).catch((res) => console.log(res));
        } else {
            setErrors(updateErrors);
        }
    }

    return (
        <div>
            <NavBar />
            <Container className="mt-5">
                <div className="d-flex justify-content-around"> 
                    <Form>
                        <Form.Group className="mt-4">     
                            <Form.Label>Адрес эл. почты</Form.Label>
                            <Form.Control type="email" className="custom-form-input" defaultValue={email} onChange={(e) => setEmail(e.target.value)} />
                            {errors.email ? <div style={{color: "red"}}>{errors.email}</div> : null}
                        </Form.Group>
                        <Form.Group className="mt-4">
                            <Form.Label>Логин</Form.Label>
                            <Form.Control type="text" className="custom-form-input" defaultValue={username} onChange={(e) => setUsername(e.target.value)} />
                            {errors.username ? <div style={{color: "red"}}>{errors.username}</div> : null}
                        </Form.Group>
                        <Form.Group className="mt-4">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control type="text" className="custom-form-input" defaultValue={name} onChange={(e) => setName(e.target.value)} />
                            {errors.name ? <div style={{color: "red"}}>{errors.name}</div> : null}
                        </Form.Group>
                        <Form.Group className="mt-4">
                            <Form.Label>Фамилия</Form.Label>
                            <Form.Control type="text" className="custom-form-input" defaultValue={surname} onChange={(e) => setSurname(e.target.value)} />
                            {errors.surname ? <div style={{color: "red"}}>{errors.surname}</div> : null}
                        </Form.Group>
                        <Form.Group className="mt-4">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control type="password" className="custom-form-input" defaultValue={password} onChange={(e) => setPassword(e.target.value)} />
                            {errors.password ? <div style={{color: "red"}}>{errors.password}</div> : null}
                        </Form.Group>
                        <Form.Group className="mt-4">
                            <Form.Label>Пол</Form.Label>
                            <Form.Select className="custom-form-input"  defaultValue={gender} onChange={(e) => setGender(e.target.value)}>
                                <option value="Мужской">Мужской</option>
                                <option value="Женский">Женский</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mt-4">
                            <Form.Label>Город</Form.Label>
                            <Form.Control type="text" className="custom-form-input" defaultValue={city} onChange={(e) => setCity(e.target.value)}/>
                            {errors.city ? <div style={{color: "red"}}>{errors.city}</div> : null}
                        </Form.Group>
                        <Form.Group className="mt-4">
                            <Form.Label>Возраст</Form.Label>
                            <Form.Control type="integer" className="custom-form-input" defaultValue={age} onChange={(e) => setAge(e.target.value)}/>
                            {errors.age ? <div style={{color: "red"}}>{errors.age}</div> : null}
                        </Form.Group>
                        <Form.Group className="mt-4">
                            <Form.Label>О себе</Form.Label>
                            <Form.Control as="textarea" rows={7} style={{border: "1px solid #000"}} defaultValue={about} onChange={(e) => setAbout(e.target.value)}/>
                        </Form.Group>
                        <Button className="custom-form-button mt-5" type="submit" onClick={updateUser}>Обновить профиль</Button>
                    </Form>
                </div>
            </Container>
        </div>
    )
}

export default Profile;