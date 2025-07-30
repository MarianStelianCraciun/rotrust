import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Service for authentication-related API calls
 */
const authService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Response with token and user info
   */
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username: email,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Login failed' };
    }
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Response with user info
   */
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Registration failed' };
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} - Response with user profile
   */
  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/users/me`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to get user profile' };
    }
  },

  /**
   * Update user profile
   * @param {Object} userData - User profile data to update
   * @returns {Promise} - Response with updated user profile
   */
  updateProfile: async (userData) => {
    try {
      const response = await axios.put(`${API_URL}/users/me`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to update profile' };
    }
  }
};

export default authService;