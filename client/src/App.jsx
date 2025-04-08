import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Home from './pages/Home'; // Example: the dashboard after login
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext'; // you'll create this
import './App.css'

function App() {

  const { isAuthenticated } = useAuth(); // get login state
  return (
    <Router>
      <Routes>
        <Route path="/" element={!isAuthenticated ? <LandingPage /> : <Navigate to="/home" />} />
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/home" />} />
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/"} />} />
      </Routes>
    </Router>
  )
}

export default App
