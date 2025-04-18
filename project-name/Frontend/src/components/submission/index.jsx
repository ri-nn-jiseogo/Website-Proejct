import React, { useState } from "react";
import "./submission.css";
import { useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { useRecoilValue } from "recoil";
import { userState } from "../../models/userinfos";   // Recoil User info

const Submission = () => {
  const navigate = useNavigate();
  const user     = useRecoilValue(userState);        // { Id, name, level … }

  /* ---------- local state ---------- */
  const [userCode, setUserCode] = useState(
`public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}`
  );
  const [responseMsg, setResponseMsg] = useState("");

  /* ---------- handlers ---------- */
  const handleBack = () => navigate(-1);

  const handleGiveUp = () => {
    if (window.confirm("Do you want to skip question?")) {
      navigate("/user/learning/lesson1/next");
    }
  };

  const handleSubmit = async () => {
    setResponseMsg("Grading...");
    try {
      const res = await fetch("http://localhost:5050/api/submit-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code:       userCode,          // Submission Code
          userID:     user?.Id,          // User ID (Recoil)
          category:   "Array",           // Question Category
          problem_id: "Q1"               // Question ID
        }),
      });

      const data = await res.json();
      if (data.result === "Correct") {
        setResponseMsg("Correct!");
      } else if (data.result === "compile_error") {
        setResponseMsg("Compile Error:\n" + data.message);
      } else if (data.result === "Incorrect") {
        setResponseMsg("Incorrect.");
      } else {
        setResponseMsg(`Error: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      console.error(error);
      setResponseMsg("Server Disconnected.");
    }
  };

  /* ---------- render ---------- */
  return (
    <div className="content">
      {/* Content area */}
      <div className="TextBox">
        <div className="flex-container">
          <h1 className="missons">Missions</h1>
        </div>
        <p className="stage-desc">
          In the game, you are allowed to participate in up to 15 missions at a time.
          <br />
          If you wish to join more missions, you must wait for a cooldown period before you can continue.
        </p>
      </div>

      <div className="submission-container">
        <section className="mission">
          <h1 className="title">Mission</h1>
          <div className="mission-desc">
            <p className="mission-content">This is a mission.</p>
          </div>

          <button className="btn-back" onClick={handleBack}>Back</button>
        </section>

        <section className="right-panel">
          <div className="code">
            <h1 className="title">Code</h1>
            <CodeMirror
              value={userCode}
              height="100%"
              theme={dracula}
              extensions={[java()]}
              className="code-editor"
              onChange={(value) => setUserCode(value)}
            />
          </div>

          <div className="right-buttons">
            <button className="btn-giveup" onClick={handleGiveUp}>GIVE UP</button>
            <button className="btn-submit" onClick={handleSubmit}>CHECK!</button>

            {/* Result */}
            <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
              <strong>Result: {responseMsg}</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Submission;
