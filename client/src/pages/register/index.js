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


function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("Мужской");
    const [city, setCity] = useState("");
    const [age, setAge] = useState(14);
    const [about, setAbout] = useState("");
    const [image, setImage] = useState(null);

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    function previewFile() {
        var preview = document.getElementsByClassName("preview")[0];
        var file    = document.querySelector('input[type=file]').files[0];
        var reader  = new FileReader();
      
        reader.onloadend = function () {
          preview.src = reader.result;
        }
      
        if (file) {
          reader.readAsDataURL(file);
          setImage(file);
        } else {
          preview.src = "";
        }
      }

    const createUser = (event) => {
        event.preventDefault();

        let registerErrors = {};
        
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

        const userFormData = new FormData();

        for (const [key, value] of Object.entries(userData)) {
            if (value == "") {
                registerErrors[key] = "Поле обязательно для заполнения!";
            }
        }

        userFormData.append("data", JSON.stringify(userData));

        if (image) {
            userFormData.append("avatar", image);
        }

        for (const value of userFormData.values()) {
            console.log(value);
          }

        const fullUrl = API_URL + "/api/users/";
        if (Object.keys(registerErrors).length == 0) {
            axios.post(fullUrl, userFormData).then((res) => {
                localStorage.setItem("access", res.data.access);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                navigate("/interests");
            }).catch((res) => console.log(res));
        } else {
            setErrors(registerErrors);
        }
    }

    return (
        <div>
            <NavBar />
            <Container className="mt-5">
                <div className="d-flex justify-content-around"> 
                    <Image src={registerImg1} />
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
                            {errors.about ? <div style={{color: "red"}}>{errors.about}</div> : null}
                        </Form.Group>
                        <Form.Group className="mt-4">
                            <Form.Label>Загрузить аватарку</Form.Label>
                            <div>
                                <img className="preview text-align-center" src="" />
                            </div>
                            <Form.Control type="file" onChange={previewFile} style={{border: "1px solid #000"}}/>
                        </Form.Group>
                        <Button className="custom-form-button mt-5" type="submit" onClick={createUser}>Зарегистрироваться</Button>
                        <p className="register-text">
                            Уже есть учётная запись? <br /> 
                            <Link to="/login" style={{ color: "#3f7dfc" }}>Войти</Link>
                        </p>
                    </Form>
                    <Image src={registerImg2} />
                </div>
            </Container>
        </div>
    )
}

export default Register;