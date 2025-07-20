// LessonPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useRecoilValue } from 'recoil';
import { userState } from '../../models/userinfos.js';
import styles from './lesson.module.css';
import classNames from 'classnames';
import { LESSON_FIRESTORE_DOCS, LESSON_TITLES } from '../../constants/lessons';
import BackButton from '../common/BackButton';

const pointsMap = {
  difficult: 30,
  moderate: 20,
  easy: 10,
};

export default function LessonPage() {
  const { lesson } = useParams();
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const lessonTitle = LESSON_TITLES[lesson] || lesson;
  const lessonFirestoreDoc = LESSON_FIRESTORE_DOCS[lesson] || lesson;
  const [questions, setQuestions] = useState([]);
  const [solvedIds, setSolvedIds] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      const docRef = doc(db, 'Questions', lessonFirestoreDoc);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists) {
        const data = docSnap.data();
        setQuestions(Object.entries(data).map(([id, q]) => ({ id, ...q })));
      }
    };
    fetchQuestions();
  }, [lessonFirestoreDoc]);

  useEffect(() => {
    if (!user?.Id) return;
    const fetchSolved = async () => {
      const colRef = collection(db, 'UserSolvedProblems');
      const q = query(
        colRef,
        where('userId', '==', user.Id),
        where('category', '==', lessonFirestoreDoc)
      );
      const snap = await getDocs(q);
      const ids = new Map();
      snap.forEach(d => ids.set(d.data().questionId, { correct: d.data().correct }));
      setSolvedIds(ids);
    };
    fetchSolved();
  }, [user?.Id, lessonFirestoreDoc]);

  const canTry =
    solvedIds !== null &&
    questions.some(q => !solvedIds.has(q.id));

  return (
    <div className={styles['lesson-page']}>
      <div className='align-self-start'>
        <BackButton to="/user/learning" />
      </div>
      <h1 className={styles['lesson-page__info-title']}>Learning Missions</h1>
      <div
        className={classNames(
          'flex-column flex-lg-row align-items-center align-items-lg-start',
          styles['lesson-page__header']
        )}>
        <div className='desc-container'>
          <p className={styles['lesson-page__info-desc']}>
            In this lesson, you will solve problems on <strong>{lessonTitle}</strong>. In the game,
            you are allowed to participate in up to 15 missions at a time.
            <strong> Click &quot;Try!&quot; to start coding.</strong>
          </p>
        </div>
        <button
          className={styles['lesson-page__try-button']}
          onClick={() => navigate(`/user/learning/${lesson}/submission`)}
          disabled={!canTry}
        >
          <span className={styles['lesson-page__try-button-main']}>Try!</span>
          <span className={styles['lesson-page__try-button-sub']}>{lessonTitle}</span>
        </button>
      </div>
      <div className={styles['lesson-page__history']}>
        <h2 className={styles['lesson-page__history-title']}>Lesson Mission List</h2>
        <table className={styles['lesson-page__history-table']}>
          <thead>
            <tr>
              <th scope='col'>ID</th>
              <th scope='col'>Difficulty</th>
              <th scope='col'>Title</th>
              <th scope='col'>Points Received</th>
              <th scope='col'>Action</th>
            </tr>
          </thead>
          <tbody>
            {solvedIds !== null &&
              questions
                .slice()
                .sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
                .map(q => {
                  const pts = pointsMap[q.Difficulty.toLowerCase()] || 0;
                  const isSolved = solvedIds.has(q.id);
                  const questionStatus = solvedIds.get(q.id)?.correct;
                  const isSkip = questionStatus === 'giveup' || questionStatus === 'Incorrect';
                  return (
                    <tr className={styles['lesson-page__history-row']} key={q.id}>
                      <th scope='row' className={styles['lesson-page__cell']}>{q.id}</th>
                      <td className={classNames('text-capitalize', styles['lesson-page__cell'])}>
                        {q.Difficulty}
                      </td>
                      <td className={styles['lesson-page__cell']}>{q.title}</td>
                      <td className={styles['lesson-page__cell']}>{pts} pts</td>
                      <td>
                        <button
                          className={classNames(
                            'btn-hover-transition',
                            isSkip
                              ? styles['lesson-page__retry-button']
                              : styles['lesson-page__review-button'],
                            !isSolved && 'disabled'
                          )}
                          disabled={!isSolved}
                          onClick={() => {
                            if (isSkip) {
                              navigate(`/user/learning/${lesson}/submission/${q.id}`);
                            } else {
                              navigate(`/user/learning/${lesson}/review/${q.id}`);
                            }
                          }}
                        >
                          {isSkip ? 'Retry' : 'Review'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
