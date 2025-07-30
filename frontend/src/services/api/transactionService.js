import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Service for transaction-related API calls
 */
const transactionService = {
  /**
   * Get all transactions with optional filtering
   * @param {Object} filters - Optional filters (property_id, seller_id, buyer_id, status)
   * @returns {Promise} - Response with transactions list
   */
  getTransactions: async (filters = {}) => {
    try {
      // Convert filters object to query string
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const queryString = queryParams.toString();
      const url = queryString ? `${API_URL}/transactions/transfers?${queryString}` : `${API_URL}/transactions/transfers`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch transactions' };
    }
  },

  /**
   * Get transaction by ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise} - Response with transaction details
   */
  getTransactionById: async (transactionId) => {
    try {
      const response = await axios.get(`${API_URL}/transactions/transfers/${transactionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch transaction details' };
    }
  },

  /**
   * Create a new property transfer transaction
   * @param {Object} transactionData - Transaction data
   * @returns {Promise} - Response with created transaction
   */
  createTransfer: async (transactionData) => {
    try {
      const response = await axios.post(`${API_URL}/transactions/transfers`, transactionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to create transaction' };
    }
  },

  /**
   * Cancel a transaction
   * @param {string} transactionId - Transaction ID
   * @returns {Promise} - Response with cancelled transaction
   */
  cancelTransaction: async (transactionId) => {
    try {
      const response = await axios.put(`${API_URL}/transactions/transfers/${transactionId}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to cancel transaction' };
    }
  },

  /**
   * Get transactions for a specific property
   * @param {string} propertyId - Property ID
   * @returns {Promise} - Response with property transactions
   */
  getPropertyTransactions: async (propertyId) => {
    try {
      const response = await axios.get(`${API_URL}/transactions/transfers?property_id=${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch property transactions' };
    }
  },

  /**
   * Get transactions for a specific user (as buyer or seller)
   * @param {string} userId - User ID
   * @param {string} role - Role ('buyer' or 'seller')
   * @returns {Promise} - Response with user transactions
   */
  getUserTransactions: async (userId, role = 'buyer') => {
    try {
      const paramName = role === 'seller' ? 'seller_id' : 'buyer_id';
      const response = await axios.get(`${API_URL}/transactions/transfers?${paramName}=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch user transactions' };
    }
  }
};

export default transactionService;