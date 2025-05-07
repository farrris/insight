import "./index.css";
import NavBar from "../../components/navbar";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect, useState } from "react";
import { API_URL } from "../../constants.js"
import axios from "axios";
import PeopleCard from "../../components/people-card/index.js";
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

function PeopleFeed() {
    const [peoples, setPeoples] = useState([]);
    const [interests, setInterests] = useState([]);
    const [filterSearch, setFilterSearch] = useState("");
    const [filterInterest, setFilterInterest] = useState("Любой");
    const [filterCity, setFilterCity] = useState("");
    const [filterAgeFrom, setFilterAgeFrom] = useState("Любой");
    const [filterAgeTo, setFilterAgeTo] = useState("Любой");
    const [filterGender, setFilterGender] = useState("Любой");

    const getPeoples = () => {
        const fullUrl = API_URL + "/api/users";
        let filters = {}
        if (filterSearch != "") filters.name = filterSearch;
        if (filterInterest != "Любой") filters.interests = filterInterest;
        if (filterCity != "") filters.city = filterCity;
        if (filterAgeFrom != "Любой") filters.age_from = filterAgeFrom;
        if (filterAgeTo != "Любой") filters.age_to = filterAgeTo;
        if (filterGender != "Любой") filters.gender = filterGender;

        axios.get(fullUrl, {
            params: filters
        }).then((response) => {
            setPeoples(response.data);
        });
    }

    const getInterests = () => {
        const fullUrl = API_URL + "/api/interests";
        axios.get(fullUrl).then((response) => {
            setInterests(response.data);
        });
    }

    useEffect(() => {
        getPeoples();
        getInterests();
    }, [filterSearch, filterAgeFrom, filterAgeTo, filterCity, filterGender, filterInterest]);

    return (
        <div className="people-feed-container">
            <NavBar />
            <Container className="mt-4">
                <Row>
                    <Col lg={9} className="peoples-col">
                        <div className="people-grid">
                            {peoples.map((people) => (
                                <PeopleCard people={people} key={people.id} />
                            ))}
                        </div>
                    </Col>

                    <Col lg={3} className="filter-col">
                        <Card className="filter-card">
                            <Card.Body>
                                <Card.Title className="filter-title">Фильтры</Card.Title>

                                <Form.Group className="mb-3">
                                    <Form.Label>Поиск по имени</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Введите имя..."
                                        className="filter-input"
                                        value={filterSearch}
                                        onChange={(e) => setFilterSearch(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Интересы</Form.Label>
                                    <Form.Select
                                        className="filter-input"
                                        value={filterInterest}
                                        onChange={(e) => setFilterInterest(e.target.value)}
                                    >
                                        <option value="Любой">Все интересы</option>
                                        {interests.map((interest) => (
                                            <option value={interest.id} key={interest.id}>{interest.title}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Город</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Введите город..."
                                        className="filter-input"
                                        value={filterCity}
                                        onChange={(e) => setFilterCity(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Возраст</Form.Label>
                                    <div className="d-flex age-filters">
                                        <Form.Select
                                            className="filter-input me-2"
                                            value={filterAgeFrom}
                                            onChange={(e) => setFilterAgeFrom(e.target.value)}
                                        >
                                            <option value="Любой">От</option>
                                            {Array.from({length: 74}, (_, i) => i + 7).map(age => (
                                                <option key={`from-${age}`} value={age}>{age}</option>
                                            ))}
                                        </Form.Select>
                                        <Form.Select
                                            className="filter-input"
                                            value={filterAgeTo}
                                            onChange={(e) => setFilterAgeTo(e.target.value)}
                                        >
                                            <option value="Любой">До</option>
                                            {Array.from({length: 74}, (_, i) => i + 7).map(age => (
                                                <option key={`to-${age}`} value={age}>{age}</option>
                                            ))}
                                        </Form.Select>
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Пол</Form.Label>
                                    <Form.Select
                                        className="filter-input"
                                        value={filterGender}
                                        onChange={(e) => setFilterGender(e.target.value)}
                                    >
                                        <option value="Любой">Любой</option>
                                        <option value="Мужской">Мужской</option>
                                        <option value="Женский">Женский</option>
                                    </Form.Select>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default PeopleFeed;