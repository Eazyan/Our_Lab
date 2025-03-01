import React, { useState, useEffect } from 'react';
import BookingForm from '../components/Booking/BookingForm';
import BookingHistory from '../components/Booking/BookingHistory';
import { getDevices, getBookings } from '/Users/eazyan/Documents/Our_Lab/our-lab-frontend/src/utils/api.js'; // Для получения данных о приборах и бронированиях
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
        alert(`Прибор забронирован с ${startTime} до ${endTime}`);
      
        const selectedDeviceObj = devices.find((device) => device.id === selectedDevice);
      
        if (selectedDeviceObj) {
          // Создаем объект для нового бронирования
          const newBooking = {
            deviceId: selectedDevice,
            deviceName: selectedDeviceObj.name,
            startTime,
            endTime,
            status: 'Ожидает подтверждения',  // Статус по умолчанию
          };
      
          try {
            // Отправляем POST запрос для сохранения на сервере
            const response = await axios.post('http://localhost:5001/bookings', newBooking);
      
            // Обновляем список бронирований, добавляя новое
            setBookings((prevBookings) => [
              ...prevBookings,
              response.data,  // Ответ от сервера, который содержит данные нового бронирования
            ]);
      
            toast.success('Бронирование успешно создано!');
          } catch (error) {
            console.error('Ошибка при создании бронирования:', error);
            toast.error('Не удалось создать бронирование.');
          }
        } else {
          console.error('Прибор не найден');
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
