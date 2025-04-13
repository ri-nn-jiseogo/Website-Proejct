
import "./lesson1.css";
import { Link } from "react-router-dom"


const lesson1 = () => {
    return (
        <div>
            <div className="content">
                <div className="TextBox">
                    <div className="flex-container">
                        <h1 className="missons">Missons</h1>
                    </div>
                    <p className="stage-desc">In the game, you are allowed to participate in up to 15 missions at a time. <br /> If you wish to join more missions, you must wait for a cooldown period before you can continue.</p>
                </div>
                <div className="chapter-container">
                    <div className="Chapter">
                        <Link to="/user/learning/lesson1/submission">
                            <h1 className="chapter-title">Try!</h1>
                            <div className="chapter-desc">
                                <p>Primitive Types</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default lesson1;