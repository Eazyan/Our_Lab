import axios from 'axios';
import { getToken, setToken, removeToken } from './auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';
export const apiUrl = API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      const event = new Event('authStateChanged');
      window.dispatchEvent(event);
    }
    return Promise.reject(error);
  }
);

export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      setToken(response.data.access_token);
    }
    return response.data;
  } catch (error) {
    if (error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDevices = async () => {
  try {
    const response = await api.get('/devices');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getBookings = async () => {
  try {
    const response = await api.get('/bookings');
    console.log('Ответ API о бронированиях:', response);
    const bookings = response?.data || [];
    console.log('Обработанные данные бронирований:', bookings);
    return bookings;
  } catch (error) {
    console.error('Ошибка при получении бронирований:', error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteBooking = async (bookingId) => {
  try {
    await api.delete(`/bookings/${bookingId}`);
  } catch (error) {
    throw error;
  }
};

export const confirmBooking = async (bookingId) => {
  try {
    const response = await api.patch(`/bookings/${bookingId}/confirm`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelBooking = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/bookings/${id}/cancel`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Ошибка при отмене бронирования');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

export default api;
