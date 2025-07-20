import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { userState } from '../../models/userinfos.js';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import styles from './mypage.module.css';
import classNames from 'classnames';

export default function MyPage() {
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userState);
  const recoilUser = useRecoilValue(userState);
  const [userInfo, setUserInfo] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!recoilUser.Id) return;
    const userDocRef = doc(db, 'users', recoilUser.Id);
    const unsubscribe = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        setUserInfo(snap.data());
      }
    });
    return () => unsubscribe();
  }, [recoilUser.Id]);

  const handleSignOut = () => {
    setUser({ Id: undefined, name: undefined });
    navigate('/login');
  };

  const handleDeleteAccount = () => setShowDeleteModal(true);
  const handleConfirmDelete = async () => {
    try {
      await fetch('/api/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: recoilUser.Id }),
      });
      setShowDeleteModal(false);
      setUser({ Id: undefined, name: undefined });
      navigate('/login');
    } catch (err) {
      console.error('계정 삭제 실패:', err);
    }
  };
  const handleCancelDelete = () => setShowDeleteModal(false);

  if (!userInfo) {
    return <div className={styles['my-page']}>Loading...</div>;
  }

  const { email, firstname, lastname, grade, stats, challenges } = userInfo;
  const missionSolved = stats.difficult + stats.moderate + stats.easy;
  const solvedTotal = missionSolved + challenges;
  const totalPoints =
    stats.difficult * 30 + stats.moderate * 20 + stats.easy * 10 + challenges * 100;

  return (
    <div className={styles['my-page']}>
      <h1 className={styles['my-page__title']}>My Page</h1>

      <div className={styles['my-page__card']}>
        <h2 className={styles['my-page__welcome']}>
          Welcome, {firstname} {lastname}!
        </h2>
        <div className={styles['my-page__content']}>
          <div className={styles['my-page__profile']}>
            <h3 className={styles['my-page__section-title']}>Profile</h3>
            <p className={styles['my-page__text']}>
              <strong>Email:</strong> {email}
            </p>
            <p className={styles['my-page__text']}>
              <strong>Name:</strong> {firstname} {lastname}
            </p>
            <p className={styles['my-page__text']}>
              <strong>Grade:</strong> {grade}
            </p>
          </div>
          <div className={styles['my-page__activity']}>
            <h3 className={styles['my-page__section-title']}>Learning Activity Logs</h3>
            <p className={styles['my-page__text']}>
              <strong>Total Points Earned:</strong> {totalPoints.toLocaleString()} points
            </p>
            <p className={styles['my-page__text']}>
              <strong>Total Questions Solved:</strong> {solvedTotal} Questions
            </p>
            <p className={classNames(styles['my-page__text'], styles['my-page__indent'])}>
              Lesson Missions: {missionSolved} Questions
            </p>
            <p className={classNames(styles['my-page__text'], styles['my-page__indent'])}>
              Challenges: {challenges} Questions
            </p>
            <p className={classNames(styles['my-page__text'], styles['my-page__indent'])}>
              Difficult: {stats.difficult} Questions
            </p>
            <p className={classNames(styles['my-page__text'], styles['my-page__indent'])}>
              Moderate: {stats.moderate} Questions
            </p>
            <p className={classNames(styles['my-page__text'], styles['my-page__indent'])}>
              Easy: {stats.easy} Questions
            </p>
          </div>
        </div>
      </div>

      <div className={styles['my-page__actions']}>
        <button
          className={classNames(styles['my-page__button'], styles['my-page__button--delete'])}
          onClick={handleDeleteAccount}>
          Delete Account
        </button>
        <button
          className={classNames(styles['my-page__button'], styles['my-page__button--signout'])}
          onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      {showDeleteModal && (
        <div className={styles['delete-modal-overlay']}>
          <div className={styles['delete-modal-content']}>
            <h2>Are you sure?</h2>
            <p>Do you really want to delete your account? This action cannot be undone.</p>
            <div className={styles['delete-modal-buttons']}>
              <button onClick={handleCancelDelete}>CANCEL</button>
              <button onClick={handleConfirmDelete}>YES</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
