// src/components/submission/index.jsx
import { useState, useEffect } from 'react';
import styles from './submission.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorView } from '@uiw/react-codemirror';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { userState } from '../../models/userinfos.js';
import classNames from 'classnames';
import { LESSON_FIRESTORE_DOCS } from '../../constants/lessons';
import { loadingState } from '../../models/loading';

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

const POINTS_MAP = {
  easy: 10,
  moderate: 20,
  hard: 30,
};

const LESSON_MAP = {
  lesson1: 'Primitive_types',
  lesson2: 'If_statements',
  lesson3: 'Iteration',
  lesson4: 'Array',
  lesson5: 'ArrayList',
  lesson6: 'Array_2d',
  lesson7: 'Recursion',
  lesson8: 'Random',
};

export default function Submission() {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const { lesson, questionId } = useParams();
  const collectionName = LESSON_MAP[lesson] || lesson;
  const setLoading = useSetRecoilState(loadingState);
  const [currentDifficulty, setCurrentDifficulty] = useState('');
  const [currentProblemId, setCurrentProblemId] = useState('');
  const [missionContent, setMissionContent] = useState('Loading...');
  const [userCode, setUserCode] = useState(`
public class Main {
    public static void main(String[] args) {
      // Write your code here
  }
}
`);
  const [showgiveupModal, setgiveupModal] = useState(false);
  const [showcorrectModal, setcorrectModal] = useState(false);
  const [showincorrectModal, setincorrectModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const handleSkip = async () => {
    try {
      await fetch(`${BASE}/api/skip-problem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.Id,
          category: collectionName,
          questionId: currentProblemId,
        }),
      });
    } catch (err) {
      console.error('Skip failed:', err);
    } finally {
      setgiveupModal(false);
      setUserCode(INITIAL_CODE);
      fetchProblem();
    }
  };

  const fetchNextProblem = async () => {
    const res = await fetch(`${BASE}/api/next-problem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userID: user?.Id,
        category: collectionName,
      }),
    });
    const data = await res.json();

    return {
      currentProblemId: data.nextProblemId,
      problemData: data.problemData,
    };
  };

  const fetchCurrentProblem = async (currentProblemId) => {
    const firestoreLesson = LESSON_FIRESTORE_DOCS[lesson];
    const res = await fetch(
      `${BASE}/api/get-problem?lesson=${firestoreLesson}&problem_id=${currentProblemId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const data = await res.json();

    return {
      currentProblemId,
      problemData: data[currentProblemId],
    };
  };

  const fetchProblem = async () => {
    try {
      let data;
      if (questionId) {
        data = await fetchCurrentProblem(questionId);
      } else {
        data = await fetchNextProblem();
      }

      if (data.message) {
        setShowFinishModal(true);
        return;
      }

      if (data.currentProblemId && data.problemData) {
        setCurrentProblemId(data.currentProblemId);
        setCurrentDifficulty((data.problemData.Difficulty || '').toLowerCase());
        setMissionContent(data.problemData.Question || 'No description.');
      } else {
        setMissionContent('No more problems left.');
      }
    } catch (err) {
      console.error('Failed to fetch problem:', err);
      setMissionContent('Failed to load problem.');
    }
  };

  useEffect(() => {
    fetchProblem();
  }, [navigate]);

  const handleBack = () => navigate(`/user/learning/${lesson}`);
  const handleGiveUp = () => setgiveupModal(true);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE}/api/submit-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: userCode,
          userID: user?.Id,
          category: collectionName,
          problem_id: currentProblemId,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.result === 'Correct') {
        setcorrectModal(true);
      } else {
        setincorrectModal(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles['flex-container']}>
        <h1 className={styles['missions-title']}>Missions</h1>
        <p className={styles['stage-desc']}>
          In the game, you are allowed to participate in up to 15 missions at a time.
          <br />
          If you wish to join more missions, you must wait for a cooldown period before you can
          continue.
        </p>
      </div>

      <div className={styles['submission-container']}>
        <div className={styles.panels}>
          <h1 className={styles.title}>Mission</h1>
          <div className={styles['mission-desc']}>
            <p className={styles['mission-content']}>{missionContent}</p>
          </div>
          <button
            className={classNames('btn-hover-transition', styles['btn-back'])}
            onClick={handleBack}>
            Back
          </button>
        </div>
        <div className={styles.panels}>
          <h1 className={styles.title}>Code</h1>

          <div className={styles['code-editor-container']}>
            <CodeMirror
              value={userCode}
              height='100%'
              theme={dracula}
              extensions={[java(), editorTheme]}
              onChange={setUserCode}
            />
          </div>

          <div className={styles['right-buttons']}>
            <button
              className={classNames('btn-hover-transition', styles['btn-giveup'])}
              onClick={handleGiveUp}>
              GIVE UP
            </button>
            <button
              className={classNames('btn-hover-transition', styles['btn-submit'])}
              onClick={handleSubmit}>
              CHECK!
            </button>
          </div>
        </div>
      </div>

      {showgiveupModal && (
        <div className={styles['popup-overlay']}>
          <div className={styles['popup-content']}>
            <h2>Skip?</h2>
            <ol>
              <li>Are you sure you want to skip this question?</li>
              <li>You may not receive any points.</li>
            </ol>
            <div className={styles['popup-buttons']}>
              <button className='btn-hover-transition' onClick={() => setgiveupModal(false)}>
                Cancel
              </button>
              <button className='btn-hover-transition' onClick={handleSkip}>
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {showFinishModal && (
        <div className={styles['popup-overlay']}>
          <div className={styles['popup-content']}>
            <h2>Correct!</h2>
            <ol>
              <li>You are rewarded ({POINTS_MAP[currentDifficulty]}) points!</li>
              <li>You don’t have any missions to try.</li>
            </ol>
            <div className={styles['popup-buttons']}>
              <button
                className='btn-hover-transition'
                onClick={() => {
                  setShowFinishModal(false);
                  navigate(-1);
                }}>
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {showcorrectModal && (
        <div className={styles['popup-overlay']}>
          <div className={styles['popup-content']}>
            <h2>Correct!</h2>
            <ol>
              <li>You are rewarded ({POINTS_MAP[currentDifficulty] || 0}) point.</li>
              <li>Try the next one!</li>
            </ol>
            <div className={styles['popup-buttons']}>
              <button className='btn-hover-transition' onClick={() => setcorrectModal(false)}>
                Stop
              </button>
              <button
                className='btn-hover-transition'
                onClick={() => {
                  if (questionId) {
                    navigate(`/user/learning/${lesson}/submission`, { replace: true});
                  }
                  setcorrectModal(false);
                  setUserCode(INITIAL_CODE);
                  fetchProblem();
                }}>
                More
              </button>{' '}
            </div>
          </div>
        </div>
      )}

      {showincorrectModal && (
        <div className={styles['popup-overlay']}>
          <div className={styles['popup-content']}>
            <h2>Incorrect!</h2>
            <ol>
              <li>Your Code is incorrect.</li>
              <li>Find mistakes to receive the point!</li>
            </ol>
            <div className={styles['popup-buttons']}>
              <button className='btn-hover-transition' onClick={() => setincorrectModal(false)}>
                Stop
              </button>
              <button className='btn-hover-transition' onClick={() => setincorrectModal(false)}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
