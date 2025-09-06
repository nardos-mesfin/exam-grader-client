// src/context/AuthContext.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs once when the app loads to check if the user is already logged in.
    const checkUser = async () => {
      try {
        const { data } = await api.get('/api/user');
        setUser(data);
      } catch (error) {
        // If the request fails (e.g., 401 Unauthorized), it means no user is logged in.
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// This is a custom hook that makes it easy to use our context in other components.
export const useAuth = () => {
  return useContext(AuthContext);
};