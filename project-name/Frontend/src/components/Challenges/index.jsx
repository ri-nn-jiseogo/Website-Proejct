import { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../../models/userinfos.js';
import { loadingState } from '../../models/loading.js';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import styles from './challenges.module.css';
import classNames from 'classnames';
const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

export default function Challenges() {
  const user = useRecoilValue(userState);
  const setLoading = useSetRecoilState(loadingState);
  const nickname = user.Id;
  const navigate = useNavigate();
  const topics = [
    { label: 'Array', value: 'Array' },
    { label: 'ArrayList', value: 'ArrayList' },
    { label: '2D Array', value: '2D_array' },
    { label: 'Random', value: 'Random' },
  ];
  const [challenges, setChallenges] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(topics[0].value);

  useEffect(() => {
    const fetchChallenges = async () => {
      if (!nickname) return;
      const snap = await getDoc(doc(db, 'Challenges', nickname));
      if (snap.exists()) {
        const data = snap.data();
        const list = Object.entries(data).map(([qid, q]) => ({
          id: qid,
          title: q.title,
          points: 100,
        }));
        list.sort((a, b) => {
          const na = parseInt(a.id.slice(1), 10);
          const nb = parseInt(b.id.slice(1), 10);
          return na - nb;
        });
        const listWithStatus = await Promise.all(
          list.map(async (item) => {
            const submissionId = `${nickname}_${item.id}`;
            const subSnap = await getDoc(doc(db, 'UserChallengeSubmissions', submissionId));
            return { ...item, reviewed: subSnap.exists() };
          })
        );
        setChallenges(listWithStatus);
      } else {
        setChallenges([]);
      }
    };
    fetchChallenges();
  }, [nickname]);

  const challengeGenerate = async () => {
    const lessonKey = selectedLesson;
    const username = user.Id;
    try {
      setLoading(true);
      const res = await fetch(
        `${BASE}/api/gpt-challenge?lesson=${lessonKey}&username=${username}`
      );
      if (res.ok) {
        navigate('/user/challenges/submission');
      } else {
        const body = await res.json();
        alert('Failed: ' + (body.error || res.statusText));
      }
    } catch {
      alert('Network Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.challenges}>
      <h1 className={styles['challenges__title']}>Challenges</h1>
      <div className={styles['challenges__text-box']}>
        <div className='desc-container'>
          <p className={styles['challenges__description']}>
            Once you have completed all the lessons, you can challenge yourself with a task that
            combines various lesson topics,
            <br />
            allowing you to earn more points by focusing on your weak areas.
          </p>
        </div>
        <div className={classNames('desc-container', styles['challenges-analysis'])}>
          <h1 className={styles['challenges-analysis-title']}>Challenge!</h1>
          <select
            className={classNames('form-select', styles['challenges-select'])}
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}>
            {topics.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <div className={styles['challenges-analysis-topic']}>
            <button
              onClick={challengeGenerate}
              className={classNames('btn-hover-transition', styles['challenge-generate-btn'])}>
              Try!
            </button>
          </div>
        </div>
      </div>

      <div className={styles['challenges-content']}>
        <div className={styles['challenges-container']}>
          <h1 className={styles['challenges-graph-title']}>Challenge Problem History</h1>
          <div className={`${styles['challenges-row']} ${styles['challenges-row--header']}`}>
            <span className={styles['challenges-cell']}>ID</span>
            <span className={styles['challenges-cell']}>Title</span>
            <span className={styles['challenges-cell']}>Points</span>
            <span className={styles['challenges-cell']}>Action</span>
          </div>
          {challenges.map((q) => (
            <div className={styles['challenges-row']} key={q.id}>
              <span className={styles['challenges-cell']}>{q.id}</span>
              <span className={styles['challenges-cell']}>{q.title}</span>
              <span className={styles['challenges-cell']}>{q.points}</span>
              {q.reviewed ? (
                <button
                  onClick={() => navigate(`/user/challenges/review/${q.id}`)}
                  className={classNames(
                    'btn-hover-transition',
                    styles['challenges-review-button']
                  )}>
                  Review
                </button>
              ) : (
                <button
                  onClick={() => navigate(`/user/challenges/submission/${q.id}`)}
                  className={classNames('btn-hover-transition', styles['challenge-retry-btn'])}>
                  Retry
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
