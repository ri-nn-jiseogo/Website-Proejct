import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function BackButton({ to }) {
  const navigate = useNavigate();
  const styles = { fontFamily: "'Slackey', cursive" };

  return (
    <Button
      style={styles}
      onClick={() => navigate(to ?? -1)} 
    >
      {'\u2190'} Go Back
    </Button>
  );
}