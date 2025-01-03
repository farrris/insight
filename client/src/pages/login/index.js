import NavBar from "../../components/navbar"
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { Image } from "react-bootstrap";
import loginImg from "../../assets/login-img.png"
import "./index.css"
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../constants";
import { useState } from "react";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const login = (event) => {
        event.preventDefault();

        let loginErrors = {};

        if (username == "") {
            loginErrors.username = "Поле обязательно для заполнения"
        }

        if (password == "") {
            loginErrors.password = "Поле обязательно для заполнения"
        }

        const loginData = {
            username,
            password
        }

        const fullUrl = API_URL + "/api/token/pair";
        if (Object.keys(loginErrors).length == 0) {
            axios.post(fullUrl, loginData).then((res) => {
                localStorage.setItem("access", res.data.access);
                localStorage.setItem("user", JSON.stringify(res.data.user));
                navigate("/peoples");
            }).catch((res) => {
                loginErrors.unsuccessLogin = "Неверный логин или пароль";
                setErrors(loginErrors);
                console.log(errors);
            });
        } else {
            setErrors(loginErrors);
        }
    }

    return (
        <div>
            <NavBar />
            <Container className="mt-5">
                <div className="d-flex justify-content-between"> 
                    <Form>
                        <p className="welcome-text">Добро пожаловать в сообщество по интересам!</p>
                        <Form.Group className="mt-4">
                            <Form.Label>Логин</Form.Label>
                            <Form.Control type="text" className="custom-form-input" onChange={e => setUsername(e.target.value)} />
                            {errors.username ? <div style={{color: "red"}}>{errors.username}</div> : null}

                        </Form.Group>
                        <Form.Group className="mt-4">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control type="password" className="custom-form-input" onChange={e => setPassword(e.target.value)} />
                            {errors.password ? <div style={{color: "red"}}>{errors.password}</div> : null}
                            {errors.unsuccessLogin ? <div style={{color: "red"}}>{errors.unsuccessLogin}</div> : null}
                        </Form.Group>
                        <Button className="custom-form-button mt-5" type="submit" onClick={login}>Войти</Button>
                        <p className="register-text">
                            Ещё нет учётной записи? <br /> 
                            <Link to="/register" style={{ color: "#3f7dfc" }}>Зарегистрироваться</Link>
                        </p>
                    </Form>
                    <Image src={loginImg} />
                </div>
            </Container>
        </div>
    )
}

export default Login;