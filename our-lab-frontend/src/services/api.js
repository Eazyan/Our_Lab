import axios from 'axios';
import { getToken } from '../utils/auth';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
    headers: {
        'Content-Type': 'application/json'
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
            localStorage.clear();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// API методы для работы с приборами
export const deviceService = {
    getDevices: async () => {
        const response = await api.get('/devices');
        return response.data;
    },
    
    getDevice: async (id) => {
        const response = await api.get(`/devices/${id}`);
        return response.data;
    },
    
    updateDevice: async (id, data) => {
        const response = await api.put(`/devices/${id}`, data);
        return response.data;
    }
};

// API методы для работы с бронированиями
export const bookingService = {
    getBookings: async () => {
        const response = await api.get('/bookings');
        return response.data;
    },
    
    getBooking: async (id) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },
    
    createBooking: async (data) => {
        const response = await api.post('/bookings', data);
        return response.data;
    },
    
    updateBooking: async (id, data) => {
        const response = await api.patch(`/bookings/${id}`, data);
        return response.data;
    },
    
    deleteBooking: async (id) => {
        const response = await api.delete(`/bookings/${id}`);
        return response.data;
    },

    confirmBooking: async (id) => {
        const response = await api.patch(`/bookings/${id}/confirm`);
        return response.data;
    },

    cancelBooking: async (id) => {
        const response = await api.patch(`/bookings/${id}/cancel`);
        return response.data;
    }
};

export default api; 