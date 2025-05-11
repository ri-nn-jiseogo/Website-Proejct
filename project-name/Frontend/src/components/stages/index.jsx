import React from "react";
import "./stages.css";

export default function Stages() {
  const userPoints = 8300;
  const solved = {
    Difficult: 30,
    Moderate: 64,
    Easy: 20,
    Challenge: 20,
  };

  return (
    <div className="stages-container">
      <div className="stages__main">
        <h1 className="stages__title">Stages</h1>
        <p className="stages__subtitle">
          Collect points to climb through each stage!<br />
          If you complete hidden missions along the way, you can also skip stages!
        </p>

        <div className="stages__points-box">
          <span className="points-box__value">
            {userPoints.toLocaleString()}
          </span>
          <span className="points-box__label">Points</span>
        </div>

        <div className="stages__solved-box">
          <h2 className="solved-box__header">SOLVED</h2>
          {Object.entries(solved).map(([level, count]) => (
            <div className="solved-box__row" key={level}>
              <span className="row__label">{level}</span>
              <span className="row__value">{count}</span>
              <span className="row__unit">Questions</span>
            </div>
          ))}
        </div>
      </div>

      <div className="stages__right">
        <div className="placeholder-box">temp placeholder</div>
        <div className="placeholder-box">temp placeholder</div>
      </div>
    </div>
  );
}
