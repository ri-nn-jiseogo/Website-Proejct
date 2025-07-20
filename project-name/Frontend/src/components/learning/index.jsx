import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import styles from './learning.module.css';
import classNames from 'classnames';

const lessons = [
  { id: 'lesson1', title: 'Lesson 1', desc: 'Primitive Types' },
  { id: 'lesson2', title: 'Lesson 2', desc: 'Boolean Expressions' },
  { id: 'lesson3', title: 'Lesson 3', desc: 'Iteration' },
  { id: 'lesson4', title: 'Lesson 4', desc: 'Array' },
  { id: 'lesson5', title: 'Lesson 5', desc: 'ArrayList' },
  { id: 'lesson6', title: 'Lesson 6', desc: '2D Array' },
  { id: 'lesson7', title: 'Lesson 7', desc: 'Recursion' },
  { id: 'lesson8', title: 'Lesson 8', desc: 'Random' },
];

export default function Learning() {
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const snap = await getDoc(doc(db, 'Settings', 'LessonStatus'));
      setStatus(snap.exists() ? snap.data() : {});
    };
    fetchStatus();
  }, []);

  if (status === null) {
    return;
  }

  return (
    <div className={styles['learning-container']}>
      <div className={styles['learning__header']}>
        <h1 className={styles['learning__title']}>Learning Missions</h1>

        <button className={styles['learning__help-btn']} onClick={() => setShowModal(true)}>
          ?
        </button>
      </div>
      <div className={styles['learning__text-box']}>
        <div className='desc-container'>
          <p className={styles['learning__description']}>
            In the game, you are allowed to participate in up to 15 missions at a time.
            <br />
            If you wish to join more missions, you must wait for a cooldown period before you can
            continue.
          </p>
        </div>
      </div>

      <div className={styles['chapter-container']}>
        {lessons.map(({ id, title, desc }) => {
          const isOpen = status[id];
          const chapterClass = classNames(styles.chapter, {
            [styles.locked]: !isOpen,
          });
          return (
            <div className={chapterClass} key={id}>
              {isOpen ? (
                <Link to={`/user/learning/${id}`} className={styles['chapter-link']}>
                  <h1 className={styles['chapter-title']}>{title}</h1>
                  <p className={styles['chapter-desc']}>{desc}</p>
                </Link>
              ) : (
                <div className={styles['chapter-link']}>
                  <h1 className={styles['chapter-title']}>{title}</h1>
                  <p className={styles['chapter-desc']}>{desc}</p>
                  <p className={styles['locked-text']}>Temporarily Locked</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className={styles['modal-overlay']}>
          <div className={styles['modal-content']}>
            <h2>How To Receive Points?</h2>
            <ol>
              <li>1. Lessons are &quot;Not Opened&quot; until unlocked by the admin.</li>
              <li>2. Once opened, a green button appears to start solving.</li>
              <li>3. Each lesson has 10 questions with random difficulty.</li>
              <li>4. Hard questions give 30 points, medium 20, easy 10.</li>
              <li>5. Total possible points per lesson range from 100 to 300.</li>
              <li>
                6. After completing all 10 questions, the lesson is temporarily locked for 1 week.
              </li>
              <li>7. You can review locked lessons anytime.</li>
              <li>8. Solve at your own pace over multiple days.</li>
            </ol>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
