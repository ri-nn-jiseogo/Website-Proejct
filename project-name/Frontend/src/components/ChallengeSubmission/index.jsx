import { useState, useEffect } from 'react';
import styles from './ChallengeSubmission.module.css';
import missionStyles from '../submission/submission.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorView } from '@uiw/react-codemirror';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../../models/userinfos.js';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import classNames from 'classnames';
import { loadingState } from '../../models/loading.js';
const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050";

const editorTheme = EditorView.theme({
  '&': {
    fontFamily: "'Fira Code', monospace",
    fontSize: '20px',
  },
  '.cm-content': {
    textAlign: 'left',
  },
});

const INITIAL_CODE = `public class Main {
    public static void main(String[] args) {
        // Write your code here
    }
}`;

export default function ChallengeSubmission() {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const setLoading = useSetRecoilState(loadingState);
  const user = useRecoilValue(userState);
  const userId = user?.Id;
  const [currentProblemId, setCurrentProblemId] = useState('');
  const [missionContent, setMissionContent] = useState('Loading...');
  const [userCode, setUserCode] = useState(INITIAL_CODE);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showCorrectModal, setShowCorrectModal] = useState(false);
  const [showIncorrectModal, setShowIncorrectModal] = useState(false);

  const fetchChallenge = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const snap = await getDoc(doc(db, 'Challenges', userId));
      if (snap.exists()) {
        const data = snap.data();
        const keys = Object.keys(data).sort((a, b) => {
          const na = parseInt(a.slice(1), 10);
          const nb = parseInt(b.slice(1), 10);
          return na - nb;
        });
        const latest = keys[keys.length - 1];
        setCurrentProblemId(latest);
        setMissionContent(data[latest].Question || 'No description.');
      } else {
        setMissionContent('No challenge available.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRetryChallenge = async () => {
    if (!userId || !questionId) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${BASE}/api/get-challenge?user_id=${userId}&problem_id=${questionId}`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        setCurrentProblemId(questionId);
        setMissionContent(data[questionId].Question);
      }
    } catch (error) {
      console.error(error);
      setMissionContent('No challenge available');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (questionId) {
      fetchRetryChallenge();
    } else {
      fetchChallenge();
    }
  }, [questionId, userId]);

  const handleBack = () => navigate(-1);

  const handleSkip = async () => {
    try {
      setLoading(true);
      await fetch(`${BASE}/api/skip-challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, category: 'Challenges', questionId: currentProblemId }),
      });
    } catch {
      console.error('Skip error');
    } finally {
      setLoading(false);
      setShowSkipModal(false);
      setUserCode(INITIAL_CODE);
      fetchChallenge();
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE}/api/submit-challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, questionId: currentProblemId, code: userCode }),
      });
      const data = await res.json();
      if (data.result === 'Correct') setShowCorrectModal(true);
      else setShowIncorrectModal(true);
    } catch {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={missionStyles.content}>
      <div className={missionStyles.Textbox}>
        <div className={missionStyles['flex-container']}>
          <h1 className={missionStyles['missions-title']}>Challenge</h1>
        </div>
      </div>

      <div className={missionStyles['submission-container']}>
        <div className={missionStyles.panels}>
          <h1 className={missionStyles.title}>Mission</h1>
          <div className={missionStyles['mission-desc']}>
            <p className={missionStyles['mission-content']}>{missionContent}</p>
          </div>
          <button
            className={classNames('btn-hover-transition', missionStyles['btn-back'])}
            onClick={handleBack}>
            Back
          </button>
        </div>
        <div className={missionStyles.panels}>
          <h1 className={missionStyles.title}>Code</h1>

          <div className={missionStyles['code-editor-container']}>
            <CodeMirror
              value={userCode}
              height='100%'
              theme={dracula}
              extensions={[java(), editorTheme]}
              onChange={setUserCode}
            />
          </div>
          <div className={missionStyles['right-buttons']}>
            <button
              className={classNames('btn-hover-transition', missionStyles['btn-giveup'])}
              onClick={() => setShowSkipModal(true)}>
              GIVE UP
            </button>
            <button
              className={classNames('btn-hover-transition', styles['submit-btn'])}
              onClick={handleSubmit}>
              SUBMIT
            </button>
          </div>
        </div>
      </div>

      {showSkipModal && (
        <div className={missionStyles['popup-overlay']}>
          <div className={missionStyles['popup-content']}>
            <h2>Skip?</h2>
            <ol>
              <li>Are you sure you want to skip this question?</li>
              <li>You may not receive any points.</li>
            </ol>
            <div className={missionStyles['popup-buttons']}>
              <button className='btn-hover-transition' onClick={() => setShowSkipModal(false)}>
                Cancel
              </button>
              <button className='btn-hover-transition' onClick={handleSkip}>
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {showCorrectModal && (
        <div className={missionStyles['popup-overlay']}>
          <div className={missionStyles['popup-content']}>
            <h2>Correct!</h2>
            <ol>
              <li>Well done! You solved the challenge.</li>
            </ol>
            <div className={missionStyles['popup-buttons']}>
              <button className='btn-hover-transition' onClick={() => setShowCorrectModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showIncorrectModal && (
        <div className={missionStyles['popup-overlay']}>
          <div className={missionStyles['popup-content']}>
            <h2>Incorrect!</h2>
            <ol>
              <li>Your code is incorrect.</li>
              <li>Fix errors and try again.</li>
            </ol>
            <div className={missionStyles['popup-buttons']}>
              <button className='btn-hover-transition' onClick={() => setShowIncorrectModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
