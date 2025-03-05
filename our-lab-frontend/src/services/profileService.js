import api from './api';

export const profileService = {
    // Получить профиль пользователя
    getProfile: async () => {
        const response = await api.get('/profile');
        return response.data;
    },

    // Обновить профиль
    updateProfile: async (userData) => {
        const response = await api.put('/profile', userData);
        return response.data;
    },

    // Получить статистику бронирований
    getStats: async () => {
        const response = await api.get('/profile/stats');
        return response.data;
    },

    // Получить бронирования пользователя
    getBookings: async () => {
        const response = await api.get('/profile/bookings');
        return response.data;
    }
}; 