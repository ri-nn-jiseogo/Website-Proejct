// src/components/MyPage/MyPage.jsx
import React from 'react';
import './myPage.css';
import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { userState } from '../../models/userinfos';

const MyPage = () => {
  const setUser = useSetRecoilState(userState);
  const navigate = useNavigate();
  
  const handleSignOut = () => {
    setUser({ Id: undefined, name: undefined });
    navigate("/login");
  };
  
  const user = {
    email: 'lily@test.com',
    name: 'Lily Kim',
    grade: 3,
    totalPoints: 33800,
    solvedTotal: 300,
    missionSolved: 250,
    challenges: 50,
    stats: { difficult: 200, moderate: 30, easy: 70 },
  };

  return (
    <div className="my-page">
      <h1 className="my-page__title">My Page</h1>

      <div className="my-page__card">
        <h2 className="my-page__welcome">Welcome, {user.name}!</h2>

        <div className="my-page__content">
          <div className="my-page__profile">
            <h3 className="my-page__section-title">Profile</h3>
            <p className="my-page__text"><strong>Email:</strong> {user.email}</p>
            <p className="my-page__text"><strong>Name:</strong> {user.name}</p>
            <p className="my-page__text"><strong>Grade:</strong> {user.grade}</p>
            {/* <button
              className="my-page__button my-page__button--edit"
            >
              Edit
            </button> */}
          </div>

          <div className="my-page__activity">
            <h3 className="my-page__section-title">Learning Activity Logs</h3>
            <p className="my-page__text">
            <strong>Total Points Earned:</strong> {user.totalPoints.toLocaleString()} points
            </p>
            <p className="my-page__text">
              <strong>Total Questions Solved:</strong> {user.solvedTotal} Questions
            </p>
            <p className="my-page__text my-page__indent">
              Lesson Missions: {user.missionSolved} Questions
            </p>
            <p className="my-page__text my-page__indent">
              Challenges: {user.challenges} Questions
            </p>
            <p className="my-page__text my-page__indent">Difficult: {user.stats.difficult} Questions</p>
            <p className="my-page__text my-page__indent">Moderate: {user.stats.moderate} Questions</p>
            <p className="my-page__text my-page__indent">Easy: {user.stats.easy} Questions</p>
          </div>
        </div>
      </div>

      <div className="my-page__actions">
        <button
          className="my-page__button my-page__button--delete"
        >
          Delete Account
        </button>
        <button
          className="my-page__button my-page__button--signout"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default MyPage;
