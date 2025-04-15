
import "./lesson1.css";
import { Link } from "react-router-dom"


const lesson1 = () => {
    return (
        <div>
            <div className="content">
                <div className="Topbox">
                    <div className="TextBox">
                        <div className="flex-container">
                            <h1 className="missons">Missons</h1>
                        </div>
                        <p className="stage-desc">In the game, you are allowed to participate in up to 15 missions at a time. <br /> If you wish to join more missions, you must wait for a cooldown period before you can continue.</p>
                    </div>
                    <div className="Chapter">
                        <Link to="/user/learning/lesson1/submission" className="chapter-link">
                            <h1 className="chapter-title">Try!</h1>
                            <div className="chapter-desc">
                                <p>Primitive Types</p>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="mission-container">
                    <h1 className="mission-title">Lesson Mission History</h1>
                    <div className="missions">
                        <h1 className="section-name">Date</h1>
                        <h1 className="section-name">Topic</h1>
                        <h1 className="section-name">Difficulty</h1>
                        <h1 className="section-name">Question</h1>
                        <h1 className="section-name">Point Received</h1>
                    </div>
                    <div className="missions">
                        <h1 className="section-name">2024-01-01</h1>
                        <h1 className="section-name">Strings</h1>
                        <h1 className="section-name">Hard</h1>
                        <h1 className="section-name">Lorem Ipsum</h1>
                        <h1 className="section-name">120</h1>
                        <button className="Review-button">Review</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default lesson1;