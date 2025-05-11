// src/components/lessonPage/index.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './lessonPage.css';

// Map lesson IDs to human-readable titles
const LESSON_TITLES = {
  lesson1: 'Primitive Types',
  lesson2: 'Boolean Expressions and if Statements',
  lesson3: 'Iteration',
  lesson4: 'Array',
  lesson5: 'ArrayList',
  lesson6: '2D Array',
  lesson7: 'Recursion',
  lesson8: 'Random',
};

export default function LessonPage() {
  const navigate = useNavigate();
  const { lesson } = useParams();              
  const lessonTitle = LESSON_TITLES[lesson] || lesson;

  return (
    <div className="lesson-page">
      <div className="lesson-page__header">
        <div className="lesson-page__info">
          <h1 className="lesson-page__info-title">Missions</h1>
          <p className="lesson-page__info-desc">
            In this lesson, you will solve problems on <strong>{lessonTitle}</strong>.<br />
            In the game, you are allowed to participate in up to 15 missions at a time.<br />
            <strong>Click "Try!" to start coding.</strong>
          </p>
        </div>

        <button
          className="lesson-page__try-button"
          onClick={() => navigate(`/user/learning/${lesson}/submission`)}
        >
          <span className="lesson-page__try-button-main">Try!</span>
          <span className="lesson-page__try-button-sub">{lessonTitle}</span>
        </button>
      </div>

      <div className="lesson-page__history">
        <h2 className="lesson-page__history-title">Lesson Mission List</h2>
        <div className="lesson-page__history-row lesson-page__history-row--header">
          <span className="lesson-page__cell">Info</span>
          <span className="lesson-page__cell">Topic</span>
          <span className="lesson-page__cell">Difficulty</span>
          <span className="lesson-page__cell">Question</span>
          <span className="lesson-page__cell">Points</span>
        </div>
        <div className="lesson-page__history-row">
          <span className="lesson-page__cell">Success</span>
          <span className="lesson-page__cell">Strings</span>
          <span className="lesson-page__cell">Hard</span>
          <span className="lesson-page__cell">Lorem Ipsum</span>
          <span className="lesson-page__cell">120</span>
          <button className="lesson-page__review-button">Review</button>
        </div>
      </div>
    </div>
  );
}
