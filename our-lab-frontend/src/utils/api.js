import axios from 'axios';

// Изменяем apiUrl для работы в локальной среде разработки
// Используем localhost вместо backend
const apiUrl = 'http://localhost:5001';

// Экспортируем apiUrl для использования в других компонентах
export { apiUrl };

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
    console.log('API createBooking вызван с параметрами:', { deviceId, startTime, endTime });
    
    // Получаем устройство по deviceId
    const selectedDeviceResponse = await axios.get(`${apiUrl}/devices/${deviceId}`);
    
    // Если прибор не найден, выбрасываем ошибку
    if (!selectedDeviceResponse.data) {
      throw new Error(`Прибор с ID ${deviceId} не найден`);
    }
    
    const selectedDevice = selectedDeviceResponse.data;
    
    // Создаем объекты дат и применяем коррекцию часового пояса
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    // Преобразуем в локальное время без смещения UTC
    // Создаем строку в формате YYYY-MM-DDTHH:MM:SS
    const localStartTime = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}T${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}:00`;
    const localEndTime = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}T${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}:00`;
    
    // Создаем новое бронирование, включая имя прибора и статус
    const newBooking = {
      device_id: parseInt(deviceId), // Убедитесь, что device_id передается как число
      deviceName: selectedDevice.name, // Для совместимости с фронтендом
      start_time: localStartTime, // Используем локальное время без UTC преобразования
      end_time: localEndTime, // Используем локальное время без UTC преобразования
      status: 'Ожидает подтверждения', // Статус по умолчанию
    };
    
    console.log('Отправляемые данные бронирования:', newBooking);
    
    // Отправляем запрос на сервер для создания бронирования
    const response = await axios.post(`${apiUrl}/bookings`, newBooking);
    
    console.log('Ответ от сервера:', response.data);
    
    return response.data; // Возвращаем созданное бронирование
  } catch (error) {
    console.error('Ошибка при создании бронирования:', error);
    throw error;
  }
};
  
