// src/App.jsx
import './App.css';
import './fonts/Momentz.ttf';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Login from './components/login';
import Register from './components/register';
import Editor from './components/editor';
import Sidebar from './components/sidebar';
import Stages from './components/stages';
import Learning from './components/learning';
import Lecture from './components/lecture';
import LessonPage from './components/LessonPage';
import Submission from './components/submission';
import Mypage from './components/Mypage';
import Resources from './components/Resources';
import Challenges from './components/Challenges';
import Admin from './components/Admin';
import { Navigate } from 'react-router-dom';
import ReviewPage from './components/ReviewPage';
import ChallengeSubmission from './components/ChallengeSubmission';
import ChallengeReview from './components/ChallengeReview';
import LoadingOverlay from './components/common/LoadingOverlay';
import AuthWrapper from './components/common/AuthWrapper.jsx';

function Headfoot() {
  return (
    <div className='Menu'>
      <Sidebar />
      <div className='Content'>
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <BrowserRouter>
        <AuthWrapper>
          <Routes>
            <Route path='/' element={<Navigate to='/login' />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
            <Route path='/editor' element={<Editor />} />

            <Route path='/user' element={<Headfoot />}>
              <Route index element={<Stages />} />
              <Route path='learning' element={<Learning />} />
              <Route path='learning/:lesson' element={<LessonPage />} />
              <Route path='learning/:lesson/submission' element={<Submission />} />
              <Route path='learning/:lesson/submission/:questionId' element={<Submission />} />
              <Route path='learning/:lesson/review/:questionId' element={<ReviewPage />} />
              <Route path='lecture' element={<Lecture />} />

              <Route path='challenges' element={<Challenges />} />
              <Route path='challenges/submission/:questionId' element={<ChallengeSubmission />} />
              <Route path='challenges/submission' element={<ChallengeSubmission />} />
              <Route path='challenges/review/:questionId' element={<ChallengeReview />} />

              <Route path='resources' element={<Resources />} />
              <Route path='mypage' element={<Mypage />} />
              <Route path='admin' element={<Admin />} />
            </Route>
          </Routes>
        </AuthWrapper>
      </BrowserRouter>
      <LoadingOverlay />
    </>
  );
}
