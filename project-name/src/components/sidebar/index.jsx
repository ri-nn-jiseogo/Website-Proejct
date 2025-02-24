import "./sidebar.css"
import {Link} from "react-router-dom"

const Sidebar = () => {
    return(
        <div className="Sidebar">
            <ul className="side-link">
                <li><Link to ="/user">Stage & Ranking</Link></li>
                <li><Link to ="/user/learning">Learning Missions</Link></li>
                <li><Link to ="/user/challenges">Challenges</Link></li>
                <li><Link to ="/user/learning">Learning Resources</Link></li>
                <li><Link to ="/user/mypage">My Page</Link></li>
            </ul>
        </div>
    )
}

export default Sidebar