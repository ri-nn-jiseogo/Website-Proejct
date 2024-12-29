import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import Login from './components/login'
import Dashboard from './components/dashboard'
import Lecture from './components/lecture'
import Header from './components/header'

import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap';

import { userState } from './models/userinfos'
import { useSetRecoilState, useRecoilValue } from 'recoil';



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
  
  
  return (
      <div>
        <Header/>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/lecture" element={<Lecture/>} />
          <Route path="/admin" element={<div><b>This is admin</b> </div>} />
        </Routes>
        <p>footer</p>
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
          <Route path="/login" element={<Login />} />
          <Route path="/user/*" element={<Headfoot />} />
          <Route path="/gallery" element={<DetailCardPage />}>
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
