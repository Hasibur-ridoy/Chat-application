import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Nav from './components/nav.jsx'
import LoginPage from './pages/loginPage.jsx'
import SignupPage from './pages/signupPage.jsx'
import Dashboard from './pages/dashboard.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={< LoginPage />} />
        <Route path='/signup' element={< SignupPage />} />
        <Route path='/dashboard' element={< Dashboard />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
