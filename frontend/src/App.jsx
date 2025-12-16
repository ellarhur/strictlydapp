import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import Home from './pages/Home'
import LogIn from './pages/LogIn'
import ListenerDashboard from './pages/ListenerDashboard'
import CreatorDashboard from './pages/CreatorDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/ListenerDashboard" element={<ListenerDashboard />} />
        <Route path="/CreatorDashboard" element={<CreatorDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
