import { useNavigate } from "react-router-dom";
import { Image, Card } from "react-bootstrap";
import defaultAvatar from "../../assets/default-avatar.png";
import "./index.css";
import { API_URL } from "../../constants";

function PeopleCard({ people }) {
  const navigate = useNavigate();

  return (
    <Card className="people-card" onClick={() => navigate(`/people/${people.id}`)}>
      <div className="card-content">
        <div className="user-info">
          {people.avatar ? (
            <Image src={`${API_URL}${people.avatar}`} roundedCircle className="avatar" />
          ) : (
            <Image src={defaultAvatar} roundedCircle className="avatar" />
          )}
          <div className="user-details">
            <h3>{people.name} {people.surname}</h3>
            <p className="location">{people.city}</p>
            <p className="age">{people.age} лет</p>
          </div>
        </div>
        <p className="about">{people.about}</p>
        <div className="interests">
          {people.interests.map((interest) => (
            <span key={interest.id} className="interest-badge">{interest.title}</span>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default PeopleCard;