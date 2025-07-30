import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  // Get environment variables
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
  const TOKEN_KEY = process.env.REACT_APP_AUTH_TOKEN_KEY || 'rotrust_auth_token';
  const EXPIRY_KEY = process.env.REACT_APP_AUTH_EXPIRY_KEY || 'rotrust_auth_expiry';

  // Check if token is expired
  const isTokenExpired = () => {
    const expiry = localStorage.getItem(EXPIRY_KEY);
    if (!expiry) return true;
    return new Date().getTime() > parseInt(expiry);
  };

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        
        if (token && !isTokenExpired()) {
          // Set auth header
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user profile
          const response = await axios.get(`${API_URL}/users/me`);
          setCurrentUser(response.data);
        } else {
          // Clear expired token
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(EXPIRY_KEY);
          delete axios.defaults.headers.common['Authorization'];
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(EXPIRY_KEY);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [API_URL, TOKEN_KEY, EXPIRY_KEY]);

  // Login function
  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        username: email,
        password
      });
      
      const { access_token, expires_in, user_id } = response.data;
      
      // Save token and expiry
      localStorage.setItem(TOKEN_KEY, access_token);
      localStorage.setItem(EXPIRY_KEY, new Date().getTime() + expires_in * 1000);
      
      // Set auth header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Get user profile
      const userResponse = await axios.get(`${API_URL}/users/me`);
      setCurrentUser(userResponse.data);
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Failed to login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError('');
      setLoading(true);
      
      await axios.post(`${API_URL}/auth/register`, userData);
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Failed to register');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    navigate('/login');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await axios.put(`${API_URL}/users/me`, userData);
      setCurrentUser(response.data);
      return true;
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.response?.data?.detail || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;