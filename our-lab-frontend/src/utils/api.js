import axios from 'axios';
import { getToken, removeToken } from './auth';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
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
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const getDevices = async () => {
  try {
    const response = await api.get('/devices');
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении приборов:", error);
    throw error;
  }
};

export const getBookings = async () => {
  try {
    const response = await api.get('/bookings');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении бронирований:', error);
    throw error;
  }
};

export const createBooking = async (deviceId, startTime, endTime) => {
  try {
    const response = await api.post('/bookings', {
      device_id: parseInt(deviceId),
      start_time: startTime,
      end_time: endTime,
    });
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании бронирования:', error);
    throw error;
  }
};

export const apiUrl = process.env.REACT_APP_API_URL || '/api';
export default api;
