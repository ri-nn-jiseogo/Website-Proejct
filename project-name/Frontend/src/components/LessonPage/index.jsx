import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import './lessonPage.css';

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

const LESSON_FIRESTORE_DOCS = {
  lesson1: "Primitive_types",
  lesson2: "If_statements",
  lesson3: "Iteration",
  lesson4: "Array",
  lesson5: "Arraylist",
  lesson6: "2D_array",
  lesson7: "Recursion",
  lesson8: "Random",
};

const pointsMap = {
  difficult: 30,
  moderate: 20,
  easy: 10,
};

export default function LessonPage() {
  const { lesson } = useParams();
  const navigate = useNavigate();
  const lessonTitle = LESSON_TITLES[lesson] || lesson;
  const lessonFirestoreDoc = LESSON_FIRESTORE_DOCS[lesson] || lesson;
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const docRef = doc(db, "Questions", lessonFirestoreDoc);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        const data = docSnap.data();
        const parsed = Object.entries(data).map(([qid, qdata]) => ({
          id: qid,
          ...qdata
        }));
        setQuestions(parsed);
      }
    };
    fetchQuestions();
  }, [lessonFirestoreDoc]);

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
          <span className="lesson-page__cell">ID</span>
          <span className="lesson-page__cell">Difficulty</span>
          <span className="lesson-page__cell">Title</span>
          <span className="lesson-page__cell">Points Received</span>
          <span className="lesson-page__cell">Action</span>
        </div>

        {questions
          .slice()
          .sort((a, b) =>
            a.id.localeCompare(b.id, undefined, { numeric: true })
          )
          .map((q) => {
            const pts = pointsMap[q.Difficulty.toLowerCase()] || 0;
            return (
              <div className="lesson-page__history-row" key={q.id}>
                <span className="lesson-page__cell">{q.id}</span>
                <span className="lesson-page__cell">{q.Difficulty}</span>
                <span className="lesson-page__cell">{q.Question}</span>
                <span className="lesson-page__cell">{pts}</span>
                <button className="lesson-page__review-button">Review</button>
              </div>
            );
          })}
      </div>
    </div>
  );
}
