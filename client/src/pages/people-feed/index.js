import "./index.css";
import NavBar from "../../components/navbar";
import Container from 'react-bootstrap/Container';
import { useEffect, useState } from "react";
import { API_URL } from "../../constants.js"
import axios from "axios";
import PeopleCard from "../../components/people-card/index.js";
import Form from 'react-bootstrap/Form';

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
        <div>
            <NavBar />
            <Container className="mt-5">
                <div className="people-list">
                    {peoples.map((people) => (
                        <PeopleCard people={people} key={people.id} />
                    ))}
                </div>
                <div className="filter-block">
                    <Form.Label className="filter-lable">Поиск</Form.Label>
                    <Form.Control type="text" placeholder="Поиск..." className="filter-input" defaultValue={filterSearch} onChange={(e) => setFilterSearch(e.target.value)} />
                    <Form.Group controlId="exampleForm.ControlTextarea1" className="mt-4">
                        <Form.Label className="filter-lable">Интересы</Form.Label>
                        <Form.Select className="filter-input" defaultValue={filterInterest} onChange={(e) => setFilterInterest(Number(e.target.value))}>
                            <option value="Любой">Любой</option>
                            {interests.map((interest) => (
                                <option value={interest.id} key={interest.id}>{interest.title}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1" className="mt-4">
                        <Form.Label className="filter-lable">Город</Form.Label>
                        <Form.Control type="text" placeholder="Поиск..." className="filter-input" defaultValue={filterCity} onChange={(e) => setFilterCity(e.target.value)} />
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlTextarea1" className="mt-4">
                        <Form.Label className="filter-lable">Возраст</Form.Label>
                        <div className="d-flex justify-content-between">
                            <Form.Select className="filter-input" defaultValue={filterAgeFrom} onChange={(e) => setFilterAgeFrom(e.target.value)}>
                                <option value="Любой">От</option>
                                { Array(74).map((x, i) => (
                                    <option key={i} value={i+7}>{i+7}</option>
                                ))}
                            </Form.Select>
                            <Form.Select className="filter-input"  defaultValue={filterAgeTo} onChange={(e) => setFilterAgeTo(e.target.value)}>
                                <option value="Любой">До</option>
                                { [...Array(74)].map((x, i) => (
                                    <option key={i} value={i+7}>{i+7}</option>
                                ))}
                            </Form.Select>
                        </div>
                    </Form.Group>
                    <Form.Group controlId="exampleForm.ControlInput1" className="mt-4">
                        <Form.Label>Пол</Form.Label>
                        <Form.Select className="filter-input" defaultValue={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
                            <option value="Любой">Любой</option>
                            <option value="Мужской">Мужской</option>
                            <option value="Женский">Женский</option>
                        </Form.Select>
                    </Form.Group>

                </div>
            </Container>
        </div>
    )
}

export default PeopleFeed;