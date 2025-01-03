import { useEffect, useState } from "react";
import NavBar from "../../components/navbar";
import Container from 'react-bootstrap/Container';
import "./index.css";
import axios from "axios";
import { API_URL } from "../../constants";
import { useNavigate } from "react-router-dom";
import checkAuth from "../../guards/auth";

function Interests() {
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [interests, setInterests] = useState([]);
    
    const navigate = useNavigate();

    const getInterests = () => {
        const fullUrl = API_URL + "/api/interests";
        axios.get(fullUrl).then((response) => {
            setInterests(response.data);
        });
    }

    const updateUserInterests = () => {
        const fullUrl = API_URL + "/api/users/";
        const updateData = {
            interests: selectedInterests.map((interest) => interest.id)
        }
        axios.put(fullUrl, updateData).then((res) => {
            navigate("/peoples");
        }).catch((err) => console.log(err));
    }

    const selectInterest = (selectedInterest) => {
        if (selectedInterests.length < 5) {
            let newSelectedInterests = [...selectedInterests, selectedInterest];
            let newInterests = interests.filter((interest) => {
                return selectedInterest.id != interest.id;
            });

            setSelectedInterests(newSelectedInterests);
            setInterests(newInterests);
        }
    }

    const removeInterest = (interest) => {
        let newInterests = [...interests, interest];
        let newSelectedInterests = selectedInterests.filter((selectedInterest) => {
            return interest.id != selectedInterest.id;
        });

        setSelectedInterests(newSelectedInterests);
        setInterests(newInterests);
    }

    useEffect(() => {
        checkAuth();
        getInterests();
    }, [])

    return (
        <div>
            <NavBar />
            <Container className="mt-1 w-50">
                <p style={{ textAlign: "center", fontSize: "30px" }}>Интересы</p>
                <div className="d-flex justify-content-between">
                    <p style={{ fontSize: "24px" }}>{selectedInterests.length} из 5</p>
                    <div onClick={updateUserInterests} style={{ fontSize: "24px", color: "#3f7dfc" }}>Готово</div>
                </div>
                { selectedInterests.length <= 3  ? (
                <div className="d-flex justify-content-start flex-wrap flex-row">
                    {selectedInterests.map((selectedInterest) => 
                        <div key={selectedInterest.id} className="selected-interest-card" onClick={() => removeInterest(selectedInterest)}>
                            {selectedInterest.title}
                        </div>
                    )}
                </div>
                 ) : (
                <div className="d-flex justify-content-between flex-wrap flex-row">
                    {selectedInterests.map((selectedInterest) => 
                        <div key={selectedInterest.id} className="selected-interest-card" onClick={() => removeInterest(selectedInterest)}>
                            {selectedInterest.title}
                        </div>
                    )}
                </div>
                 )}
                <input type="text" placeholder="Поиск..." className="w-100 p-1 mt-4" />
                <div className="d-flex justify-content-start flex-wrap flex-row">
                    {interests.map((interest) => 
                        <div key={interest.id} className="interest-card" onClick={() => selectInterest(interest)}>
                            {interest.title}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    )
}

export default Interests;