import axios from 'axios';
import { getToken, setToken } from './auth';

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
    console.error('Ошибка в запросе:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'Произошла ошибка при выполнении запроса';
    
    if (error.code === 'ECONNABORTED') {
      errorMessage = 'Превышено время ожидания ответа от сервера';
    } else if (error.code === 'ERR_NETWORK') {
      errorMessage = 'Ошибка сети. Проверьте подключение к интернету и доступность сервера';
    } else if (error.response) {
      errorMessage = `Ошибка сервера: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
    }

    console.error('Ошибка в ответе:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      config: error.config
    });
    
    if (error.response?.status === 401) {
      window.location.href = '/';
    }

    const customError = new Error(errorMessage);
    customError.originalError = error;
    return Promise.reject(customError);
  }
);

export const login = async (credentials) => {
  try {
    console.log('Отправка запроса на авторизацию:', {
      url: `${API_URL}/auth/login`,
      credentials
    });
    
    const response = await api.post('/auth/login', credentials);
    
    console.log('Ответ сервера:', response.data);
    
    if (response.data.access_token) {
      setToken(response.data.access_token);
      console.log('Токен успешно получен и сохранен');
    }
    return response;
  } catch (error) {
    console.error('Ошибка авторизации:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      }
    });
    throw error;
  }
};

export const register = async (userData) => {
  try {
    console.log('Отправка запроса на регистрацию:', userData);
    const response = await api.post('/auth/register', userData);
    return response;
  } catch (error) {
    console.error('Ошибка регистрации:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const getDevices = async () => {
  try {
    console.log('Отправка запроса на получение списка приборов');
    const response = await api.get('/devices');
    console.log('Ответ сервера при получении приборов:', response);
    return response;
  } catch (error) {
    console.error('Ошибка при получении списка приборов:', error);
    throw error;
  }
};

export const getBookings = async () => {
  return api.get('/bookings');
};

export const createBooking = async (bookingData) => {
  return api.post('/bookings', bookingData);
};

export const deleteBooking = async (id) => {
  return api.delete(`/bookings/${id}`);
};

export default api;
