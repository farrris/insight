import logo from "../../assets/logo.png"
import { Image } from 'react-bootstrap';
import "./index.css"

function Logo() {
    return (
        <div className="d-flex justify-content-around">
            <Image src={logo} alt="logo" />
            <div className="logo-title">Insight</div>
        </div>
    )
}

export default Logo;