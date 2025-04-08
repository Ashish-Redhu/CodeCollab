import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Default: not logged in
  const [loading, setLoading] = useState(true); // Loading state

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);
  
  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/auth/check-auth', { withCredentials: true })
      setIsAuthenticated(res.data.authenticated)
    } catch {
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
