
import "./submission.css";
import { Link } from "react-router-dom"


const submission = () => {
    return (
        <div>
            <div clssName="content">
                <div className="TextBox">
                    <div className="flex-container">
                        <h1 className="missons">Missons</h1>
                    </div>
                    <p className="stage-desc">In the game, you are allowed to participate in up to 15 missions at a time. <br /> If you wish to join more missions, you must wait for a cooldown period before you can continue.</p>
                </div>
                <div className="submission-container">
                    <div className="mission">
                        <h1 className="title">Mission</h1>
                        <div className="mission-desc">
                            <p className="mission-content">
                                This is a mission
                            </p>
                        </div>
                    </div>
                    <div className="code">
                        <h1 className="title">Code</h1>
                        <input type="text" className="code-content" placeholder="This is a code" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default submission;