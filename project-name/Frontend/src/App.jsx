import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Login from './components/login/index.jsx'
import Dashboard from './components/dashboard/index.jsx'
import Lecture from './components/lecture/index.jsx'
import Header from './components/header/index.jsx'
import Register from './components/register/index.jsx'
import Editor from './components/editor/index.jsx'
import Sidebar from './components/sidebar/index.jsx'
import Stages from './components/stages/index.jsx'
import Learning from './components/learning/index.jsx'
import GPT from './components/GPT/index.jsx'
import Lesson1 from './components/lesson1/index.jsx'
import Submission from './components/submission/index.jsx'
import Mypage from './components/mypage/index.jsx'

import "./fonts/Momentz.ttf";

import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap';

import { userState } from './models/userinfos/index.js'
import { useSetRecoilState, useRecoilValue } from 'recoil';

import {addComment, addUser, getComments} from "./firebase.js";


function DetailCardPage(){
  return <p>this is detailcard</p>
}

function Headfoot(){
  const setuser = useSetRecoilState(userState);
  const user = useRecoilValue(userState);
  const navigate = useNavigate();

  useEffect(() => {
    if(user?.Id === undefined){
      console.log('user not logged in')
      navigate('/login')
    }
  }, [user, navigate])

  useEffect(() => {
    getComments().then(res => {
      console.log('comments :', res)
    })
  }, [])
  
  return (
      <div className='Menu'>
        <Sidebar></Sidebar>
        <div className = 'Content'>
          <Routes>
            <Route path="/" element={<Stages/>} />
            <Route path="/learning" element={<Learning/>} />
            <Route path="/lecture" element={<Lecture/>} />
            <Route path="/learning/lesson1" element={<Lesson1/>} />
            <Route path="/learning/lesson1/submission" element={<Submission/>} />
            <Route path="/admin" element={<div><b>This is admin</b> </div>} />
            <Route path="/mypage" element={<Mypage/>} />
          </Routes>
        </div>
        
      </div>
  )
}

function Landingpage(){
  const navigate = useNavigate();

  const handlelogin = () => {
    navigate('/login')
  }
  return (
  <div>
    <Button
      onClick={handlelogin}
    >
      Log In
    </Button>
  </div>)
}


const Router = () => {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/gpt" element={<GPT/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/user/*" element={<Headfoot />} />
          <Route path="/register" element={<Register />}/>
          <Route path="/editor" element={<Editor />}>
          </Route>
        </Routes>
    </BrowserRouter>
  );
};


function App() {
  const [count, setCount] = useState(0)
  return <Router  />
}

export default App
