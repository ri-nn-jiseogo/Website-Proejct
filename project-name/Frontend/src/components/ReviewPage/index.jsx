// src/components/review/ReviewPage.jsx
import { useState, useEffect } from 'react';
import styles from './reviewpage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { useRecoilValue } from 'recoil';
import { userState } from '../../models/userinfos.js';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import classNames from 'classnames';

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

const editorTheme = EditorView.theme({
  '&': {
    fontFamily: "'Fira Code', monospace",
    fontSize: '20px',
  },
  '.cm-content': {
    textAlign: 'left',
  },
});

export default function ReviewPage() {
  const navigate = useNavigate();
  const { lesson, questionId } = useParams();
  const user = useRecoilValue(userState);

  const collectionName = LESSON_MAP[lesson] || lesson;
  const [missionContent, setMissionContent] = useState('Loading...');
  const [userCode, setUserCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const qDoc = doc(db, 'Questions', collectionName);
        const qSnap = await getDoc(qDoc);
        if (qSnap.exists()) {
          const qData = qSnap.data()[questionId];
          setMissionContent(qData?.Question || 'No description.');
        } else {
          setMissionContent('No description.');
        }

        const colRef = collection(db, 'UserSolvedProblems');
        const solvedQuery = query(
          colRef,
          where('userId', '==', user.Id),
          where('category', '==', collectionName),
          where('questionId', '==', questionId),
          where('correct', '==', 'Correct')
        );
        const solvedSnap = await getDocs(solvedQuery);
        if (!solvedSnap.empty) {
          const docData = solvedSnap.docs[0].data();
          setUserCode(docData.code);
        } else {
          setUserCode('// No submission found.');
        }
      } catch (err) {
        console.error('Failed to load review:', err);
        setMissionContent('Failed to load problem.');
        setUserCode('// Failed to load submission.');
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, [lesson, questionId, user.Id, collectionName]);

  const handleBack = () => navigate(-1);

  if (loading) {
    return <div className={styles.content}>Loading review...</div>;
  }

  return (
    <div className={styles.content}>
      <div className='TextBox'>
        <div className={styles['flex-container']}>
          <h1 className={styles['missions-title']}>Review Mission</h1>
        </div>
        <p className={styles['stage-desc']}>
          Here is your accepted solution for problem <strong>{questionId}</strong>.
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
              editable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
