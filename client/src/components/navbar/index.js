import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from "../logo"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';

function NavBar() {
    const navigate = useNavigate();
    const userExists = localStorage.getItem("access") !== null;
    const [username, setUsername] = useState("");
    const logout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("user");
        navigate("/login");
    }

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user)
        {
            setUsername(JSON.parse(user).name);
        }
    }, []);

    return  (
        <Navbar style={{backgroundColor: "white"}}>
            <Container>
                <Navbar.Brand href="/">
                    <Logo/>
                </Navbar.Brand>
                    <div>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse className='justify-content-end'>
                            <Nav className="ml-auto">
                                <Link to="/peoples" className="nav-link" style={{ textDecoration: "none", color: "#3F3333", marginRight: "30px", display: "flex", alignItems: "center" }}>Единомышленники</Link>
                                { userExists ? (
                                    <>
                                    <Link to="/chats" className="nav-link" style={{ textDecoration: "none", color: "#3F3333", marginRight: "30px", display: "flex", alignItems: "center" }}>Чаты</Link>
                                    <NavDropdown className="nav-link" title={username} id="basic-nav-dropdown" style={{ textDecoration: "none", color: "#3F3333", marginRight: "30px", display: "flex", alignItems: "center" }}>
                                        <NavDropdown.Item as={Link} to={"/profile"}>Редактировать</NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to={"/favorites"}>Избранные</NavDropdown.Item>
                                        <NavDropdown.Item onClick={logout}>Выйти</NavDropdown.Item>
                                    </NavDropdown>
                                    </>
                                ) : null }
                            </Nav>
                        </Navbar.Collapse>
                    </div>
                
            </Container>
        </Navbar>
    )
}

export default NavBar;
