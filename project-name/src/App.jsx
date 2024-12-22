import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from './components/login'
import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap';

function DetailCardPage(){
  return <p>this is detailcard</p>
}

function Dummypage(){
  return (
        <Routes>
          <Route path="/" element={<p>header</p>} />
          <Route path="/" element={<p>footer</p>} >
        </Route>
        </Routes>
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
          <Route path="/dummy" element={<Dummypage />} />
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
