import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

/**
 * Service for property-related API calls
 */
const propertyService = {
  /**
   * Get all properties with optional filtering
   * @param {Object} filters - Optional filters (owner_id, property_type, etc.)
   * @returns {Promise} - Response with properties list
   */
  getProperties: async (filters = {}) => {
    try {
      // Convert filters object to query string
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const queryString = queryParams.toString();
      const url = queryString ? `${API_URL}/properties?${queryString}` : `${API_URL}/properties`;
      
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch properties' };
    }
  },

  /**
   * Get property by ID
   * @param {string} propertyId - Property ID
   * @returns {Promise} - Response with property details
   */
  getPropertyById: async (propertyId) => {
    try {
      const response = await axios.get(`${API_URL}/properties/${propertyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch property details' };
    }
  },

  /**
   * Register a new property
   * @param {Object} propertyData - Property data
   * @returns {Promise} - Response with registered property
   */
  registerProperty: async (propertyData) => {
    try {
      const response = await axios.post(`${API_URL}/properties`, propertyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to register property' };
    }
  },

  /**
   * Update property details
   * @param {string} propertyId - Property ID
   * @param {Object} propertyData - Updated property data
   * @returns {Promise} - Response with updated property
   */
  updateProperty: async (propertyId, propertyData) => {
    try {
      const response = await axios.put(`${API_URL}/properties/${propertyId}`, propertyData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to update property' };
    }
  },

  /**
   * Get property history
   * @param {string} propertyId - Property ID
   * @returns {Promise} - Response with property history
   */
  getPropertyHistory: async (propertyId) => {
    try {
      const response = await axios.get(`${API_URL}/properties/${propertyId}/history`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch property history' };
    }
  },

  /**
   * Verify property ownership
   * @param {string} propertyId - Property ID
   * @param {string} ownerId - Owner ID to verify
   * @returns {Promise} - Response with verification result
   */
  verifyOwnership: async (propertyId, ownerId) => {
    try {
      const response = await axios.get(`${API_URL}/properties/${propertyId}/verify?owner_id=${ownerId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to verify ownership' };
    }
  }
};

export default propertyService;