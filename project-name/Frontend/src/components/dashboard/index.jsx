import { Button } from 'react-bootstrap';
import { userState } from '../../models/userinfos.js';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const setuser = useSetRecoilState(userState);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  return (
    <div>
      class - progress Basic information
      <p>
        안녕하세요, <span>{user.name}</span>
      </p>
      <Button
        onClick={(e) => {
          e.preventDefault();
          console.log('lecture');
          navigate('/user/lecture');
        }}>
        Continue Lecture
      </Button>
      <Button
        onClick={(e) => {
          setuser({
            Id: undefined,
            name: undefined,
          });
        }}>
        Log Out
      </Button>
    </div>
  );
};

export default Dashboard;
