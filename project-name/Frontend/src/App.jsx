// src/App.jsx
import React, { useEffect } from 'react';
import './App.css';
import './fonts/Momentz.ttf';
import { BrowserRouter, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { userState } from './models/userinfos/index.js';
import { Button } from 'react-bootstrap';
import { getComments } from './firebase.js';
import Login from './components/login';
import Register from './components/register';
import GPT from './components/GPT';
import Editor from './components/editor';
import Sidebar from './components/sidebar';
import Stages from './components/stages';
import Learning from './components/learning';
import Lecture from './components/lecture';
import LessonPage from './components/LessonPage'; 
import Submission from './components/submission';
import Mypage from './components/mypage';
import Resources from './components/Resources';
import Challenges from './components/Challenges';

function Landingpage() {
  const navigate = useNavigate();
  return (
    <div className="landing">
      <Button onClick={() => navigate('/login')}>Log In</Button>
    </div>
  );
}

function AdminPage() {
  return <div><b>This is admin</b></div>;
}

function Headfoot() {
  const navigate = useNavigate();
  const setUser = useSetRecoilState(userState);
  const user = useRecoilValue(userState);

  useEffect(() => {
    if (!user?.Id) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    getComments().then(res => console.log('comments:', res));
  }, []);

  return (
    <div className="Menu">
      <Sidebar />
      <div className="Content">
        <Outlet />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/gpt" element={<GPT />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/editor" element={<Editor />} />
        <Route path="/user" element={<Headfoot />}>
          <Route index element={<Stages />} />
          <Route path="learning" element={<Learning />} />
          <Route path="learning/:lesson" element={<LessonPage />} />
          <Route path="learning/:lesson/submission" element={<Submission />} />
          <Route path="lecture" element={<Lecture />} />
          <Route path="resources" element={<Resources />} />
          <Route path="Challenges" element={<Challenges />} />
          <Route path="mypage" element={<Mypage />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
