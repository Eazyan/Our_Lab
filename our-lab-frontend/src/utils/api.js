import axios from 'axios';

const apiUrl = 'http://localhost:5001'; // Фейковый бэкенд

// Получение списка приборов
export const getDevices = async () => {
  try {
    const response = await axios.get(`${apiUrl}/devices`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении приборов:", error);
    throw error;
  }
};

// Получение списка бронирований
export const getBookings = async () => {
  try {
    const response = await axios.get(`${apiUrl}/bookings`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении бронирований:', error);
    throw error;
  }
};

// Создание бронирования
export const createBooking = async (deviceId, startTime, endTime) => {
    try {
      // Получаем устройство по deviceId
      const selectedDeviceResponse = await axios.get(`${apiUrl}/devices/${deviceId}`);
  
      // Если прибор не найден, выбрасываем ошибку
      if (!selectedDeviceResponse.data) {
        throw new Error(`Прибор с ID ${deviceId} не найден`);
      }
  
      const selectedDevice = selectedDeviceResponse.data;
  
      // Создаем новое бронирование, включая имя прибора и статус
      const newBooking = {
        deviceId,
        deviceName: selectedDevice.name, // Имя прибора
        startTime,
        endTime,
        status: 'Ожидает подтверждения', // Статус по умолчанию
      };
  
      // Отправляем запрос на сервер для создания бронирования
      const response = await axios.post(`${apiUrl}/bookings`, newBooking);
  
      return response.data; // Возвращаем созданное бронирование
    } catch (error) {
      console.error('Ошибка при создании бронирования:', error);
      throw error;
    }
  };
  
