// src/components/submission/index.jsx
import React, { useState, useEffect } from "react";
import "./submission.css";
import { useNavigate, useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { useRecoilValue } from "recoil";
import { userState } from "../../models/userinfos";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const LESSON_MAP = {
  lesson1: "Primitive_types",
  lesson2: "If_statements",
  lesson3: "Iteration",
  lesson4: "Array",
  lesson5: "ArrayList",
  lesson6: "Array_2d",
  lesson7: "Recursion",
  lesson8: "Random",
};

export default function Submission() {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const { lesson } = useParams();                         // ex. "lesson3"
  const collectionName = LESSON_MAP[lesson] || lesson;     // ex. "Iteration"

  const [userCode, setUserCode] = useState(
`public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}`
  );
  const [responseMsg, setResponseMsg] = useState("");
  const [missionContent, setMissionContent] = useState("Loading...");

  useEffect(() => {
    async function fetchMission() {
      try {
        const docRef = doc(db, "Questions", collectionName);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setMissionContent(data.Q1?.Question || "No description.");
        } else {
          setMissionContent("No mission found for this lesson.");
        }
      } catch (error) {
        console.error("Error fetching mission:", error);
        setMissionContent("Error loading mission.");
      }
    }
    fetchMission();
  }, [collectionName]);

  const handleBack = () => navigate(-1);
  const handleGiveUp = () => {
    if (window.confirm("Do you want to skip question?")) {
      navigate(`/user/learning/${lesson}`);
    }
  };

  const handleSubmit = async () => {
    setResponseMsg("Grading...");
    try {
      const res = await fetch("http://localhost:5050/api/submit-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code:       userCode,
          userID:     user?.Id,
          category:   collectionName,
          problem_id: "Q1"
        }),
      });
      const data = await res.json();
      if (data.result === "Correct")       setResponseMsg("Correct!");
      else if (data.result === "compile_error")
                                           setResponseMsg("Compile Error:\n" + data.message);
      else if (data.result === "Incorrect") setResponseMsg("Incorrect.");
      else                                   setResponseMsg(`Error: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error(error);
      setResponseMsg("Server Disconnected.");
    }
  };

  return (
    <div className="content">
      <div className="TextBox">
        <div className="flex-container">
          <h1 className="missions">Missions</h1>
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
            <p className="mission-content">{missionContent}</p>
          </div>
          <button className="btn-back" onClick={handleBack}>
            Back
          </button>
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
              onChange={setUserCode}
            />
          </div>

          <div className="right-buttons">
            <button className="btn-giveup" onClick={handleGiveUp}>
              GIVE UP
            </button>
            <button className="btn-submit" onClick={handleSubmit}>
              CHECK!
            </button>
            <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
