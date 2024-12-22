import { useState, Button } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Login from './components/login'
import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'

const navigate = useNavigate();

function DetailCardPage(){
  return <p>this is detailcard</p>
}

function Landingpage(){
  const handlelogin = () => {
    navigate('/login')
  }
  return (<div>
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
