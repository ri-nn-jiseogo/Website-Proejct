import React from "react";
import "./stages.css";
import { useRecoilValue } from "recoil";
import { userState } from "../../models/userinfos";

export default function Stages() {
  const { stats, challenges } = useRecoilValue(userState);

  const missionSolved =
    stats.difficult + stats.moderate + stats.easy;

  const solvedTotal = missionSolved + challenges;

  const totalPoints =
    stats.difficult * 30 +
    stats.moderate  * 20 +
    stats.easy      * 10 +
    challenges     * 100;

  const solved = {
    Difficult: stats.difficult,
    Moderate:  stats.moderate,
    Easy:      stats.easy,
    Challenge: challenges,
  };
  
  const userPoints = totalPoints;

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
