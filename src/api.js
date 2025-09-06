// src/api.js
import axios from 'axios';

// Create an Axios instance with default configuration
const api = axios.create({
  // Set the base URL for your Laravel API
  baseURL: 'http://localhost:8000',
  // Tell Axios to send credentials (like cookies) with every request
  withCredentials: true,
});

export default api;