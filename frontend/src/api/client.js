import axios from 'axios';

const API_BASE = 'http://localhost:8081/api';
axios.defaults.baseURL = API_BASE;

// Inject JWT Token from LocalStorage if it exists
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;
