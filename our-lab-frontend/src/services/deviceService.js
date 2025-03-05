import api from './api';

export const deviceService = {
    // Получить список всех устройств
    getDevices: async () => {
        const response = await api.get('/devices');
        return response.data;
    },

    // Получить устройство по ID
    getDevice: async (id) => {
        const response = await api.get(`/devices/${id}`);
        return response.data;
    },

    // Создать новое устройство
    createDevice: async (deviceData) => {
        const response = await api.post('/devices', deviceData);
        return response.data;
    },

    // Обновить устройство
    updateDevice: async (id, deviceData) => {
        const response = await api.put(`/devices/${id}`, deviceData);
        return response.data;
    },

    // Удалить устройство
    deleteDevice: async (id) => {
        const response = await api.delete(`/devices/${id}`);
        return response.data;
    }
}; 