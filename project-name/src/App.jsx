import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from './components/login'
import Dashboard from './components/dashboard'
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

  if(user.id === undefined){
    console.log('user not logged in')
  }
  
  return (
      <div>
        <p>header</p>
        <Routes>
          <Route path="/" element={<Dashboard/>} />
          <Route path="/2" element={<p>content 2</p>} >
        </Route>
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
