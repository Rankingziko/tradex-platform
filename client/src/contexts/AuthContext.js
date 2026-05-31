// ================================
// AUTH CONTEXT
// ================================

import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await api.getCurrentUser();
          if (response && response.user) {
            setUser(response.user);
          } else if (response && response.id) {
            // Handle if endpoint returns user directly
            setUser(response);
          }
        }
      } catch (err) {
        localStorage.removeItem('token');
        console.error('Auth check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (data) => {
    try {
      setError(null);
      const response = await api.register(data);
      api.setToken(response.token);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const login = async (data) => {
    try {
      setError(null);
      const response = await api.login(data);
      api.setToken(response.token);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  const updateProfile = async (data) => {
    try {
      const response = await api.updateProfile(data);
      setUser(response.user);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
