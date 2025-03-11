import "./sidebar.css"
import { Link } from "react-router-dom"
import { Form, Button, Alert } from "react-bootstrap";

import Logo from "../../assets/logo.png";



const Sidebar = () => {
    return (
        <div className="Sidebar">
            <div className="sidebar-wrapper">
                <ul className="side-link">
                    <img className="Logo" src={Logo} alt="logo" />
                    <li><Link to="/user">Stage & Ranking</Link></li>
                    <li><Link to="/user/learning">Learning Missions</Link></li>
                    <li><Link to="/user/challenges">Challenges</Link></li>
                    <li><Link to="/user/learning">Learning Resources</Link></li>
                    <li><Link to="/user/mypage">My Page</Link></li>
                </ul>
                <Button className="w-100" variant="primary" type="submit" href="/login">
                    Log Out
                </Button>
            </div>
        </div>
    )
}

export default Sidebar