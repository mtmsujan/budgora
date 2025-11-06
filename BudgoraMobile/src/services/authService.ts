import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', {email, password});
    await AsyncStorage.setItem('auth_token', response.data.token);
    return response.data;
  },

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password,
      password_confirmation: password,
    });
    await AsyncStorage.setItem('auth_token', response.data.token);
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('auth_token');
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/user');
    return response.data.user;
  },

  async getToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  },
};

