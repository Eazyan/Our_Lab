import React, { useState, useEffect } from 'react';
import BookingForm from '../components/Booking/BookingForm';
import BookingHistory from '../components/Booking/BookingHistory';
import { getDevices, getBookings } from '../utils/api.js'; // Для получения данных о приборах и бронированиях
import axios from 'axios';
import { toast } from 'react-toastify';

const Bookings = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState(""); // Изначально пустая строка
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const devicesData = await getDevices();
          setDevices(devicesData);
          const bookingsData = await getBookings(); // Загружаем историю бронирований
          setBookings(bookingsData);
        } catch (error) {
          console.error('Ошибка при загрузке данных:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }, []);
  
    const handleBookingSuccess = async (startTime, endTime) => {
      console.log("handleBookingSuccess вызван с:", { deviceId: selectedDevice, startTime, endTime });
      
      try {
        // Преобразуем deviceId в число
        const deviceIdNumber = parseInt(selectedDevice, 10);
        
        if (isNaN(deviceIdNumber)) {
          toast.error("Некорректный ID прибора");
          return;
        }
        
        // Получаем выбранный прибор
        const selectedDeviceObj = devices.find((device) => device.id === deviceIdNumber);
        
        console.log("Доступные приборы:", devices);
        console.log("Искомый ID прибора:", deviceIdNumber);
        console.log("Найденный прибор:", selectedDeviceObj);
        
        if (!selectedDeviceObj) {
          toast.error(`Прибор с ID ${deviceIdNumber} не найден`);
          return;
        }
        
        // Создаем объект для нового бронирования, используя поля, ожидаемые бэкендом
        const newBooking = {
          device_id: deviceIdNumber,  // Для бэкенда используем snake_case
          start_time: new Date(startTime).toISOString(),
          end_time: new Date(endTime).toISOString(),
          status: 'Ожидает подтверждения',
        };
        
        console.log("Отправляем запрос на создание бронирования:", newBooking);
        
        // Отправляем POST запрос
        const response = await axios.post('http://localhost:5001/bookings', newBooking);
        
        console.log("Ответ от сервера:", response.data);
        
        // Преобразуем ответ от сервера для соответствия формату фронтенда
        const bookingForFrontend = {
          id: response.data.id,
          deviceId: response.data.device_id,
          deviceName: selectedDeviceObj.name,
          startTime: response.data.start_time,
          endTime: response.data.end_time,
          status: response.data.status
        };
        
        // Обновляем список бронирований
        setBookings((prevBookings) => [
          ...prevBookings,
          bookingForFrontend,
        ]);
        
        toast.success('Бронирование успешно создано!');
      } catch (error) {
        console.error('Ошибка при создании бронирования:', error);
        
        // Показываем более подробную информацию об ошибке
        if (error.response) {
          // Показываем ответ от сервера, если он есть
          toast.error(`Ошибка: ${error.response.data.detail || error.message}`);
        } else {
          toast.error(`Ошибка: ${error.message}`);
        }
      }
    };
      
    if (loading) return <div>Загрузка...</div>;
  
    return (
        <div>
          <h2>Бронирование приборов</h2>
          <div>
            <h3>Выберите прибор:</h3>
            <select onChange={(e) => setSelectedDevice(e.target.value)} value={selectedDevice}>
              <option value="">Выберите прибор</option>
              {devices.map((device) => (
                <option key={device.id} value={device.id}>
                  {device.name}
                </option>
              ))}
            </select>
          </div>
          {selectedDevice && (
            <BookingForm deviceId={selectedDevice} onBookingSuccess={handleBookingSuccess} />
          )}
          <BookingHistory bookings={bookings} devices={devices} /> {/* Передаем устройства и бронирования */}
        </div>
      );
};

export default Bookings;
