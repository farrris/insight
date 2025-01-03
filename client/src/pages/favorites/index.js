import "./index.css";
import NavBar from "../../components/navbar";
import Container from 'react-bootstrap/Container';
import { useEffect, useState } from "react";
import { API_URL } from "../../constants.js"
import axios from "axios";
import PeopleCard from "../../components/people-card/index.js";
import checkAuth from "../../guards/auth.js";


function Favorites() {
    const [favorites, setFavorites] = useState([]);

    const getFavorites = () => {
        const fullUrl = API_URL + "/api/favorites";
        axios.get(fullUrl).then((response) => {
            setFavorites(response.data);
        });
    }

    useEffect(() => {
        checkAuth();
        getFavorites();
    }, []);
    return (
        <div>
            <NavBar />
            <Container className="mt-4">
                <p style={{ textAlign: "center", fontSize: "32px", marginTop: "28px" }}>Избранные</p>
                <div className="people-list">
                    {favorites.map((people) => (
                        <PeopleCard people={people} key={people.id} renderFavorites={getFavorites} />
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default Favorites;