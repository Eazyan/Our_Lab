import axios from 'axios';

// Change this to use localhost instead of backend hostname
// This will match what your browser can actually access
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Cache for devices
let devicesCache = null;
let lastDevicesFetchTime = 0;
const DEVICE_CACHE_DURATION = 30000; // 30 seconds

// Cache for bookings
let bookingsCache = null;
let lastBookingsFetchTime = 0;
const BOOKING_CACHE_DURATION = 15000; // 15 seconds

// Get all devices with proper error handling
export const getDevices = async () => {
  const now = Date.now();
  
  // Return cached data if it's fresh enough
  if (devicesCache && (now - lastDevicesFetchTime < DEVICE_CACHE_DURATION)) {
    console.log("Using cached devices data");
    return devicesCache;
  }
  
  try {
    console.log("Fetching devices from API");
    // Make sure to use the trailing slash
    const response = await axios.get(`${apiUrl}/devices/`);
    console.log("Devices API response:", response.data);
    
    // Update cache
    devicesCache = response.data || [];
    lastDevicesFetchTime = now;
    
    return devicesCache;
  } catch (error) {
    console.error("Ошибка при получении приборов:", error);
    // Return empty array on error instead of cached data (which might be null)
    return [];
  }
};

// Get all bookings with proper error handling
export const getBookings = async () => {
  const now = Date.now();
  
  // Return cached data if it's fresh enough
  if (bookingsCache && (now - lastBookingsFetchTime < BOOKING_CACHE_DURATION)) {
    console.log("Using cached bookings data");
    return bookingsCache;
  }
  
  try {
    console.log("Fetching bookings from API");
    // Make sure to use the trailing slash
    const response = await axios.get(`${apiUrl}/bookings/`);
    console.log("Bookings API response:", response.data);
    
    // Update cache
    bookingsCache = response.data || [];
    lastBookingsFetchTime = now;
    
    return bookingsCache;
  } catch (error) {
    console.error("Ошибка при получении бронирований:", error);
    // Return empty array on error
    return [];
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
    
    // Создаем новое бронирование, включая имя прибора и статус
    const newBooking = {
      device_id: parseInt(deviceId), // Убедитесь, что device_id передается как число
      deviceName: selectedDevice.name, // Для совместимости с фронтендом
      start_time: new Date(startTime).toISOString(), // Преобразуем в ISO формат
      end_time: new Date(endTime).toISOString(), // Преобразуем в ISO формат
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
  
