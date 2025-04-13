import React, { useState } from "react";
import "./submission.css";
import { useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { java } from "@codemirror/lang-java";
import { dracula } from "@uiw/codemirror-theme-dracula";

const Submission = () => {
  const navigate = useNavigate();

  // 사용자 코드, 서버 응답 메세지 관리를 위한 State
  const [userCode, setUserCode] = useState(`public class Main {\n    public static void main(String[] args) {\n        // Write your code here\n    }\n}`);
  const [responseMsg, setResponseMsg] = useState("");

  // "포기" 버튼
  const handleGiveUp = () => {
    if (window.confirm("Do you want to skip question?")) {
      navigate("/user/learning/lesson1/next");
    }
  };

  // "제출" 버튼
  const handleSubmit = async () => {
    setResponseMsg("Grading...");
    try {
      const res = await fetch("http://localhost:5000/api/submit-code", {
        method: "POST",
        headers: {                                      
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: userCode,       // 현재 코드
          problem_id: "test01", // 예시 문제 ID (실제론 해당 문제의 식별자를 사용)
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
        // 기타 에러 (runtime_error 등)
        setResponseMsg(`Error: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      console.error(error);
      setResponseMsg("Server Disconnected.");
    }
  };

  return (
    <div className="content">
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
        <div className="mission">
          <h1 className="title">Mission</h1>
          <div className="mission-desc">
            <p className="mission-content">This is a mission.</p>
          </div>
        </div>

        <div className="right-panel">
          <div className="code">
            <h1 className="title">Code</h1>
            <CodeMirror
              value={userCode}
              height="300px"
              theme={dracula}
              extensions={[java()]}
              className="code-editor"
              onChange={(value) => setUserCode(value)}
            />
          </div>

          <div className="submission-buttons">
            <div className="right-buttons">
              <button className="btn-giveup" onClick={handleGiveUp}>
                Give Up
              </button>
              <button className="btn-submit" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </div>


          <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
            <strong>결과:</strong>
            <div>{responseMsg}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submission;
