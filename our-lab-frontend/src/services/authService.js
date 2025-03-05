import api from './api';

export const authService = {
    register: async (userData) => {
        try {
            // Преобразуем данные в формат, ожидаемый бэкендом
            const registrationData = {
                full_name: userData.fullName,
                email: userData.email,
                password: userData.password,
                role: userData.role || 'student',
                phone: userData.phone || null,
                group: userData.group || null,
                department: userData.department || null
            };

            const response = await api.post('/auth/register', registrationData);
            return response.data;
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', {
                email: credentials.email,
                password: credentials.password
            });
            return response.data;
        } catch (error) {
            console.error('Ошибка входа:', error);
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    }
}; 