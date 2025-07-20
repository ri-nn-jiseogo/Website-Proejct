import { Fragment, useEffect, useState } from 'react';
import styles from './stages.module.css';
import { useRecoilValue } from 'recoil';
import { userState } from '../../models/userinfos.js';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import classNames from 'classnames';

const tierConfig = [
  { name: 'Bronze', min: 0, max: 500 },
  { name: 'Silver', min: 500, max: 1000 },
  { name: 'Gold', min: 1000, max: 1500 },
  { name: 'Diamond', min: 1500, max: 2000 },
  { name: 'Ruby', min: 2000, max: 2500 },
];

const tierColors = {
  Bronze: '#cd7f32',
  Silver: '#c0c0c0',
  Gold: '#ffd700',
  Diamond: '#b9f2ff',
  Ruby: '#e0115f',
};

export default function Stages() {
  const { Id } = useRecoilValue(userState);
  const [stats, setStats] = useState({ difficult: 0, moderate: 0, easy: 0 });
  const [challenges, setChallenges] = useState(0);

  useEffect(() => {
    if (!Id) return;
    const ref = doc(db, 'users', Id);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setStats(d.stats || { difficult: 0, moderate: 0, easy: 0 });
        setChallenges(d.challenges || 0);
      }
    });
    return () => unsub();
  }, [Id]);

  const totalPoints =
    stats.difficult * 30 + stats.moderate * 20 + stats.easy * 10 + challenges * 100;

  const idx = tierConfig.findIndex((t) => totalPoints < t.max);
  const currentIdx = idx === -1 ? tierConfig.length - 1 : idx;
  const currentTier = tierConfig[currentIdx];
  const nextTier = tierConfig[currentIdx + 1];
  const progressPct =
    currentIdx === tierConfig.length - 1
      ? 100
      : ((totalPoints - currentTier.min) / (currentTier.max - currentTier.min)) * 100;

  const solved = {
    Difficult: stats.difficult,
    Moderate: stats.moderate,
    Easy: stats.easy,
    Challenge: challenges,
  };

  const nextColor = nextTier ? tierColors[nextTier.name] : null;

  return (
    <div className={styles['stages-container']}>
      <div className={styles['stages__main']}>
        <h1 className={styles['stages__title']}>Stages</h1>
        <div className='desc-container'>
          <p className={styles['stages__subtitle']}>
            Collect points to climb through each stage! If you complete hidden missions along the
            way, you can also skip stages!
          </p>
        </div>
        <div className={styles['stages__points-box']}>
          <span className={styles['points-box__value']}>{totalPoints.toLocaleString()}</span>
          <span className={styles['points-box__label']}>Points</span>
        </div>
        <div className={styles['stages__solved-box']}>
          <h2 className={styles['solved-box__header']}>SOLVED</h2>
          <div className={styles['solved-box__grid']}>
            {Object.entries(solved).map(([level, count]) => (
              <Fragment key={level}>
                <span className={styles['row__label']}>{level}</span>
                <span className={styles['row__value']}>{count}</span>
                <span className={styles['row__unit']}>Questions</span>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <div className={styles['stages__right']}>
        <div className={styles['stages__tier-container']}>
          <div className={styles['tier-progress']}>
            <h2 className={styles['tier-progress__title']}>Tier Progress</h2>
            <div className={styles['tier-progress__circles']}>
              {tierConfig.map((t, i) => {
                const tierClass = classNames(styles['tier-circle'], {
                  [styles['tier-circle--active']]: i <= currentIdx,
                  [styles[`tier-circle--${t.name.toLowerCase()}`]]: true,
                });
                return (
                  <div key={t.name} className={tierClass}>
                    {t.name.charAt(0)}
                  </div>
                );
              })}
            </div>
            <div className={styles['tier-progress__bar']}>
              <div
                className={styles['tier-progress__bar-filled']}
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className={styles['tier-progress__message']}>
              Congratulations! You&apos;ve reached <strong>{currentTier.name}</strong>.
            </p>
            {nextTier && (
              <div className={styles['tier-progress__next']}>
                <div
                  className={styles['next-tier__icon']}
                  style={{
                    background: nextColor,
                    color: nextTier.name === 'Diamond' ? '#000' : '#fff',
                  }}>
                  {nextTier.name.charAt(0)}
                </div>
                <div className={styles['next-tier__info']}>
                  <h3 style={{ color: nextColor }}>Next Tier: {nextTier.name}</h3>
                  <p>Solve more problems to reach {nextTier.name}! Keep pushing!</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
