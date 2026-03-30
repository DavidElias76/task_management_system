import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/login/verify`, { withCredentials: true });

        if (response.data.user) {
          setIsAuthenticated(true);
          setUser(response.data.user);
          setMessage(response.data.message);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        setMessage(error.response?.data?.message || "Authentication failed");
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (username, password) => {
    const response = await axios.post(`${BASE_URL}/api/login`, { username, password }, { withCredentials: true });
    setIsAuthenticated(true);
    setUser(response.data.user ?? null);
    setMessage(response.data.message);
    return response.data;
  };

  const logout = async () => {
    await axios.post(`${BASE_URL}/api/login/logout`, {}, { withCredentials: true });
    setIsAuthenticated(false);
    setUser(null);
    setMessage("");
  };

  return (
    <AuthContext.Provider value={
      {
        isAuthenticated,
        authLoading,
        user,
        message,
        setMessage,
        login,
        logout
      }
    }>
      {children}
    </AuthContext.Provider>
  );
};


export { AuthProvider, AuthContext };