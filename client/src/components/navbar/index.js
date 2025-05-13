import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from "../logo";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import "./index.css"
import { API_URL } from '../../constants';

function NavBar() {
    const navigate = useNavigate();
    const userExists = localStorage.getItem("access") !== null;
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("user");
        navigate("/login");
    }

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            setUsername(JSON.parse(user).name);
            setUserId(JSON.parse(user).id);
            setIsAdmin(JSON.parse(user).is_superuser);
        }
    }, []);

    return (
        <Navbar expand="lg" className="modern-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="navbar-brand">
                    <Logo />
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler" />

                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="align-items-center">
                        <Nav.Link
                            as={Link}
                            to="/peoples"
                            className="nav-link-item"
                        >
                            <i className="bi bi-people-fill nav-icon"></i>
                            <span>Люди</span>
                        </Nav.Link>

                        {userExists && (
                            <>
                                <Nav.Link
                                    as={Link}
                                    to="/chats"
                                    className="nav-link-item"
                                >
                                    <i className="bi bi-chat-left-text-fill nav-icon"></i>
                                    <span>Чаты</span>
                                </Nav.Link>


                                <NavDropdown
                                  title={
                                    <div className="d-flex align-items-center">
                                      <i className="bi bi-person-circle me-2"></i>
                                      <span className="me-1 text-truncate" style={{maxWidth: '120px'}}>
                                        {username}
                                      </span>
                                      <i className="bi bi-chevron-down" style={{fontSize: '0.75rem'}}></i>
                                    </div>
                                  }
                                  id="user-dropdown"
                                  align="end"
                                  className="user-dropdown"
                                >
                                    <NavDropdown.Item as={Link} to={"/people/" + userId} className="dropdown-item">
                                        <i className="bi bi-pencil-square"></i> Профиль
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/favorites" className="dropdown-item">
                                        <i className="bi bi-heart-fill"></i> Избранные
                                    </NavDropdown.Item>
                                    { isAdmin && (
                                    <NavDropdown.Item as={Link} to={API_URL + "/admin"} className="dropdown-item">
                                        <i className="bi bi-card-checklist"></i> Админ-панель
                                    </NavDropdown.Item>
                                    )}
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={logout} className="dropdown-item">
                                        <i className="bi bi-box-arrow-right"></i> Выйти
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar;