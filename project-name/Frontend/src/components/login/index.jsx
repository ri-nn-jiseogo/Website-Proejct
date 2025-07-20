import 'bootstrap/dist/css/bootstrap.min.css';
import '../../styles.css';

import { useEffect, useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import './login.css';

import Logo from '../../assets/logo.png';

import { useNavigate } from 'react-router-dom';

import { useRecoilValue, useRecoilState } from 'recoil';

import { auth, getUsers } from '../../firebase.js';
import {
  browserSessionPersistence,
  setPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { userState } from '../../models/userinfos.js';
import { loadingState } from '../../models/loading.js';

const Login = () => {
  const [message, setMessage] = useState('');
  const [inputUsername, setInputUsername] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useRecoilState(loadingState);
  const navigate = useNavigate();
  const user = useRecoilValue(userState);

  useEffect(() => {
    const savedUsername = localStorage.getItem('savedUsername');
    const savedPassword = localStorage.getItem('savedPassword');
    if (savedUsername && savedPassword) {
      setInputUsername(savedUsername);
      setInputPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (user?.Id !== undefined) {
      if (user?.isstaff) {
        navigate('/user/admin');
      } else {
        navigate('/user');
      }
    }
  }, [navigate, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);
    await delay(500);

    if (!inputUsername || !inputPassword) {
      setMessage('One or more fields missing');
      setLoading(false);
      return;
    }

    try {
      const users = await getUsers();
      const userDoc = users.docs.find((doc) => doc.id === inputUsername);

      if (!userDoc) {
        setMessage('No such user ID');
        setLoading(false);
        return;
      }

      const userData = userDoc.data();
      const email = userData.email;

      await setPersistence(auth, browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, inputPassword);
      sessionStorage.setItem('userId', inputUsername);

      if (rememberMe) {
        localStorage.setItem('savedUsername', inputUsername);
        localStorage.setItem('savedPassword', inputPassword);
      } else {
        localStorage.removeItem('savedUsername');
        localStorage.removeItem('savedPassword');
      }
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        setMessage('password is incorrect.');
      } else {
        console.error(error);
        setMessage('Login failed: ' + error.message);
      }
    }

    setLoading(false);
  };

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <div className='sign-in__wrapper'>
      <div className='sign-in__backdrop'></div>

      <Form className='form' onSubmit={handleSubmit}>
        <img className='Logo' src={Logo} alt='logo' />

        {message && <Alert variant='warning'>{message}</Alert>}

        <Form.Group className='mb-2' controlId='username'>
          <Form.Label>User ID</Form.Label>
          <Form.Control
            type='text'
            value={inputUsername}
            placeholder='User ID'
            onChange={(e) => setInputUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            value={inputPassword}
            placeholder='Password'
            onChange={(e) => setInputPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className='mb-2' controlId='checkbox'>
          <Form.Check
            type='checkbox'
            label='Remember me'
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        </Form.Group>
        <Button className='w-100' variant='primary' type='submit' disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </Button>

        <div className='mt-2 text-center'>
          <p style={{ margin: 0 }}>
            Don&apos;t have an account?{' '}
            <span
              onClick={() => navigate('/register')}
              style={{
                textDecoration: 'underline',
                cursor: 'pointer',
              }}>
              Register Here
            </span>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default Login;
