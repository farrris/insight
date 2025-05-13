import NavBar from "../../components/navbar";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { Image, Row, Col } from "react-bootstrap";
import "./index.css";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../constants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Схема валидации
const profileSchema = yup.object().shape({
  email: yup.string().email("Некорректный email").required("Обязательное поле"),
  username: yup.string().required("Обязательное поле"),
  name: yup.string().required("Обязательное поле"),
  surname: yup.string().required("Обязательное поле"),
  password: yup.string().min(6, "Минимум 6 символов"),
  city: yup.string().required("Обязательное поле"),
  age: yup.number().min(14, "Минимальный возраст 14").max(120, "Некорректный возраст"),
});

function Profile() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(profileSchema)
  });

  const [userData, setUserData] = useState({
    email: "",
    username: "",
    name: "",
    surname: "",
    password: "",
    gender: "Мужской",
    city: "",
    age: 14,
    about: ""
  });

  const navigate = useNavigate();

  // Загрузка данных пользователя
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/me`);
        setUserData(response.data);
        reset(response.data); // Устанавливаем значения формы
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      }
    };

    fetchUserData();
  }, [reset]);

  const updateUser = async (data) => {
    try {
      await axios.put(`${API_URL}/api/users/`, data);
      navigate("/peoples");
    } catch (error) {
      console.error("Ошибка обновления:", error);
    }
  };

  return (
    <div className="profile-page">
      <NavBar />
      <Container className="profile-container py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="profile-card p-4">
              <h2 className="text-center mb-4">Редактирование профиля</h2>

              <Form onSubmit={handleSubmit(updateUser)}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        {...register("email")}
                        isInvalid={!!errors.email}
                        className="form-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Логин</Form.Label>
                      <Form.Control
                        type="text"
                        {...register("username")}
                        isInvalid={!!errors.username}
                        className="form-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.username?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Имя</Form.Label>
                      <Form.Control
                        type="text"
                        {...register("name")}
                        isInvalid={!!errors.name}
                        className="form-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.name?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Фамилия</Form.Label>
                      <Form.Control
                        type="text"
                        {...register("surname")}
                        isInvalid={!!errors.surname}
                        className="form-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.surname?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Пароль (оставьте пустым, чтобы не менять)</Form.Label>
                  <Form.Control
                    type="password"
                    {...register("password")}
                    isInvalid={!!errors.password}
                    className="form-input"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Пол</Form.Label>
                      <Form.Select
                        {...register("gender")}
                        className="form-input"
                      >
                        <option value="Мужской">Мужской</option>
                        <option value="Женский">Женский</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Возраст</Form.Label>
                      <Form.Control
                        type="number"
                        {...register("age")}
                        isInvalid={!!errors.age}
                        className="form-input"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.age?.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Город</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("city")}
                    isInvalid={!!errors.city}
                    className="form-input"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.city?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>О себе</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    {...register("about")}
                    className="form-textarea"
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" type="submit" className="submit-btn">
                    Сохранить изменения
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Profile;