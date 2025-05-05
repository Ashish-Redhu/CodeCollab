import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Default: not logged in
  const [user, setUser] = useState(null); // Store user details here
  const [loading, setLoading] = useState(true); // Loading state

  const SERVER_URL = import.meta.env.VITE_SERVER_URL; 

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };
  const logout = async () => {
    try {
      await axios.get(`${SERVER_URL}/api/auth/logout`, { withCredentials: true });
    } 
    catch (err) {
      console.error("Logout failed:", err);
    } 
    finally {
      setIsAuthenticated(false);
      setUser(null);
    }
  };
  
  const checkAuth = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/auth/checkAuth`, { withCredentials: true });
      setIsAuthenticated(res.data.authenticated);
      setUser(res.data.user || null); // Ensure backend sends user details
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
      console.error("Authentication check failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth()
  // }, [isAuthenticated, user, checkAuth]);
}, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      user,
      setUser,
      loading,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
