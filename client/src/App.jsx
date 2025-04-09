import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { useAuth } from './context/AuthContext';
import './App.css';
import { CircularProgress, Box } from '@mui/material'; // Import loading indicator

function App() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    background: 'linear-gradient(to right, #000000, #1a1a1a)',
                }}
            >
                <CircularProgress color="secondary" />
            </Box>
        );
    }

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
    );
}

export default App;