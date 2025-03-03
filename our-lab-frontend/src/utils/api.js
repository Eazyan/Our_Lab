import axios from 'axios';

const apiUrl = 'http://localhost:5001';

export { apiUrl };

export const getDevices = async () => {
  try {
    const response = await axios.get(`${apiUrl}/devices`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при получении приборов:", error);
    throw error;
  }
};

export const getBookings = async () => {
  try {
    const response = await axios.get(`${apiUrl}/bookings`);
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении бронирований:', error);
    throw error;
  }
};

export const createBooking = async (deviceId, startTime, endTime) => {
  try {
    console.log('API createBooking вызван с параметрами:', { deviceId, startTime, endTime });
    
    const selectedDeviceResponse = await axios.get(`${apiUrl}/devices/${deviceId}`);
    
    if (!selectedDeviceResponse.data) {
      throw new Error(`Прибор с ID ${deviceId} не найден`);
    }
    
    const selectedDevice = selectedDeviceResponse.data;
    
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    const localStartTime = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}T${String(startDate.getHours()).padStart(2, '0')}:${String(startDate.getMinutes()).padStart(2, '0')}:00`;
    const localEndTime = `${endDate.getFullYear()}-${String(endDate.getMonth() + 1).padStart(2, '0')}-${String(endDate.getDate()).padStart(2, '0')}T${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}:00`;
    
    const newBooking = {
      device_id: parseInt(deviceId),
      deviceName: selectedDevice.name,
      start_time: localStartTime,
      end_time: localEndTime,
      status: 'Ожидает подтверждения',
    };
    
    console.log('Отправляемые данные бронирования:', newBooking);
    
    const response = await axios.post(`${apiUrl}/bookings`, newBooking);
    
    console.log('Ответ от сервера:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Ошибка при создании бронирования:', error);
    throw error;
  }
};
