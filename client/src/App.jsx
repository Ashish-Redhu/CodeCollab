import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './Pages/LandingPage.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Auth/Login.jsx';
import Register from './pages/Auth/Register.jsx';
import RoomPage from './pages/RoomPage.jsx'; 
import { useAuth } from './context/AuthContext.jsx';
import './App.css';
import { CircularProgress, Box } from '@mui/material'; // Import loading indicator
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                <Route path="/room/:roomId" element={isAuthenticated ? <RoomPage /> : <Navigate to="/login" />} />
                <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/"} />} />
            </Routes>
            <ToastContainer />
        </Router>
    
    );
}

export default App;