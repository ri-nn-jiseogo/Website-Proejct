import { useState } from 'react';
import { Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
} from 'firebase/auth';
import { addUser, auth, getUsers } from '../../firebase.js'; // 사용자 추가 로직을 Firestore에도 저장할 경우
import Logo from '../../assets/logo.png';
import { useSetRecoilState } from 'recoil';
import { loadingState } from '../../models/loading.js';
import styles from './register.module.css';

const Register = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const setLoading = useSetRecoilState(loadingState);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const userid = e.target.elements.user.value;
    const email = e.target.elements.email.value;
    const gradeValue = e.target.elements.grade.value;
    const password = e.target.elements.passwords.value;
    const confirmpass = e.target.elements.confirmpass.value;
    const firstname = e.target.elements.firstname.value;
    const lastname = e.target.elements.lastname.value;

    if (!userid || !email || !password || !confirmpass || !firstname || !lastname || !gradeValue) {
      setMessage('One or more missing data');
      return;
    }

    const users = await getUsers();
    const exists = users.docs.some((doc) => doc.id === userid);

    if (exists) {
      setMessage('This ID already exists');
      return;
    }

    const gradeNum = Number(gradeValue);
    if (Number.isNaN(gradeNum) || gradeNum < 1 || gradeNum > 12) {
      setMessage('grade must be between 1 and 12');
      return;
    }

    if (password.length < 8) {
      setMessage('Password must be 8 letters or more');
      return;
    }

    if (password !== confirmpass) {
      setMessage('Confirm password does not match with password');
      return;
    }

    try {
      setLoading(true);
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addUser(userid, {
        Id: userid,
        uid: user.uid,
        email: email,
        firstname: firstname,
        lastname: lastname,
        grade: gradeNum,
        isstaff: false,
        tier: 'bronze',
        stats: {
          difficult: 0,
          moderate: 0,
          easy: 0,
        },
        challenges: 0,
      });

      sessionStorage.setItem('userId', userid);

      alert('Registration Success!');
      navigate('/login');
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['sign-in__wrapper']}>
      <Form className={styles['form__container']} onSubmit={handleSubmit}>
        <div className='mx-auto'>
          <img className={styles.Logo} src={Logo} alt='logo' />
        </div>

        {message && <Alert variant='warning'>{message}</Alert>}
        <div className='container'>
          <div className='row gx-4 gy-3 row-cols-1 row-cols-md-auto'>
            <div className='col col-md-6'>
              <label>User Id</label>
              <input type='text' className='form-control' name='user' placeholder='User Id' />
            </div>
            <div className='col col-md-6'>
              <label>Email</label>
              <input type='email' className='form-control' name='email' placeholder='Email' />
            </div>
            <div className='col col-md-6'>
              <label>Grade</label>
              <input
                type='grade'
                className='form-control'
                name='grade'
                placeholder='Grade (1-12)'
              />
            </div>
            <div className='col col-md-6'>
              <label>Passwords</label>
              <input
                type='password'
                className='form-control'
                name='passwords'
                placeholder='Password'
              />
            </div>
            <div className='col col-md-6'>
              <label>Confirm Password</label>
              <input
                type='password'
                className='form-control'
                name='confirmpass'
                placeholder='Confirm Password'
              />
            </div>
            <div className='col col-md-6'>
              <label>First Name</label>
              <input
                type='text'
                className='form-control'
                name='firstname'
                placeholder='First Name'
              />
            </div>
            <div className='col col-md-6'>
              <label>Last Name</label>
              <input type='text' className='form-control' name='lastname' placeholder='Last Name' />
            </div>
          </div>
          <div className='d-grid my-3'>
            <button type='submit' className='btn btn-primary'>
              Sign Up
            </button>
          </div>
          <p className='forgot-password text-right'>
            Already registered? <a href='/login'>Sign in</a>
          </p>
        </div>
      </Form>
    </div>
  );
};

export default Register;
