// src/components/lessonPage/index.jsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './lessonPage.css';

// Map lesson IDs to human-readable titles
const LESSON_MAP = {
  lesson1: 'Primitive Types',
  lesson2: 'Boolean Expressions and if Statements',
  lesson3: 'Iteration',
  lesson4: 'Array',
  lesson5: 'ArrayList',
  lesson6: '2D Array',
  lesson7: 'Recursion',
};

export default function LessonPage() {
  const { lesson } = useParams();              // e.g. "lesson3"
  const title = LESSON_MAP[lesson] || lesson;  // lookup or fallback

  return (
    <div className="content">
      <div className="Topbox">
        <div className="TextBox">
          <div className="flex-container">
            <h1 className="missions">Missions</h1>
          </div>
          <p className="stage-desc">
            In this lesson, you will solve problems on <strong>{title}</strong>.<br />
            Click "Try!" below to start coding.
          </p>
        </div>

        <div className="Chapter">
          <Link
            to={`/user/learning/${lesson}/submission`}
            className="chapter-link"
          >
            <h1 className="chapter-title">Try!</h1>
            <div className="chapter-desc">
              <p>{title}</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="mission-container">
        <h1 className="mission-title">Lesson Mission History</h1>
        <div className="missions header">
          <span className="section-name">Date</span>
          <span className="section-name">Topic</span>
          <span className="section-name">Difficulty</span>
          <span className="section-name">Question</span>
          <span className="section-name">Points</span>
        </div>
        {/* Data Example */}
        <div className="missions-row">
          <span className="section-name">2024-01-01</span>
          <span className="section-name">Strings</span>
          <span className="section-name">Hard</span>
          <span className="section-name">Lorem Ipsum</span>
          <span className="section-name">120</span>
          <button className="Review-button">Review</button>
        </div>
      </div>
    </div>
  );
}
