import { useState, useEffect } from 'react';
import missionStyles from '../submission/submission.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { EditorView } from '@uiw/react-codemirror';
import CodeMirror from '@uiw/react-codemirror';
import { java } from '@codemirror/lang-java';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { useRecoilValue } from 'recoil';
import { userState } from '../../models/userinfos.js';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import classNames from 'classnames';

const editorTheme = EditorView.theme({
  '&': {
    fontFamily: "'Fira Code', monospace",
    fontSize: '20px',
  },
  '.cm-content': {
    textAlign: 'left',
  },
});

export default function ChallengeReviewPage() {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const user = useRecoilValue(userState);
  const [missionContent, setMissionContent] = useState('Loading...');
  const [userCode, setUserCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const problemSnap = await getDoc(doc(db, 'Challenges', user.Id));
        if (problemSnap.exists()) {
          const data = problemSnap.data()[questionId];
          setMissionContent(data?.Question || 'No description.');
        } else {
          setMissionContent('No description.');
        }

        const submissionId = `${user.Id}_${questionId}`;
        const submissionSnap = await getDoc(doc(db, 'UserChallengeSubmissions', submissionId));
        if (submissionSnap.exists()) {
          setUserCode(submissionSnap.data().code);
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
  }, [questionId, user.Id]);

  const handleBack = () => navigate(-1);

  if (loading) {
    return <div className={missionStyles.content}>Loading review...</div>;
  }

  return (
    <div className={missionStyles.content}>
      <div className={missionStyles.Textbox}>
        <div className={missionStyles['flex-container']}>
          <h1 className={missionStyles['missions-title']}>Review Challenge</h1>
        </div>
        <p className={missionStyles['stage-desc']}>
          Here is your submission for challenge <strong>{questionId}</strong>.
        </p>
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
          <h1 className={missionStyles.title}>Your Code</h1>

          <div className={missionStyles['code-editor-container']}>
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
