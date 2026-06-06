import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authAPI } from '../api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Failed to restore auth state:', e);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.login(email, password);
      const { token, ...userData } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      return userData;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(
    async (email, password, firstName, lastName, role = 'STUDENT') => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await authAPI.register(
          email,
          password,
          firstName,
          lastName,
          role
        );
        const { token, ...userData } = response.data;

        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);

        return userData;
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Registration failed. Please try again.';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  );

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};
