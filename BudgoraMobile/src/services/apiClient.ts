import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update this with your backend URL
// For iOS Simulator: use 'http://localhost:8000/api/v1'
// For Physical iOS Device: use 'http://YOUR_MAC_IP:8000/api/v1'
// For Android Emulator: use 'http://10.0.2.2:8000/api/v1'
// For Physical Android Device: use 'http://YOUR_COMPUTER_IP:8000/api/v1'
const API_BASE_URL = __DEV__
  // ? 'http://localhost:8000/api/v1' // Development: local backend
  ? 'https://budgora.xyz/api/v1' // Development: local backend
  : 'https://budgora.xyz/api/v1'; // Production: live site

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// Handle token expiration
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('auth_token');
      // You can dispatch a logout action here
    }
    return Promise.reject(error);
  },
);

export default apiClient;
