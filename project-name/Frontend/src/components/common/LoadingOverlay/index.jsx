import { useRecoilValue } from 'recoil';
import { loadingState } from '../../../models/loading';
import styles from './loadingOverlay.module.css';
import Spinner from 'react-bootstrap/Spinner';

export default function LoadingOverlay() {
  const isLoading = useRecoilValue(loadingState);

  if (!isLoading) return null;

  return (
    <div className={styles.overlay}>
      <Spinner
        animation='border'
        variant='light'
        role='status'
        style={{ width: '5rem', height: '5rem', borderWidth: '0.5rem' }}>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>
    </div>
  );
}
