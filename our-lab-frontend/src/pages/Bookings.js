import React, { useState, useEffect } from 'react';
import BookingForm from '../components/Booking/BookingForm';
import BookingHistory from '../components/Booking/BookingHistory';
import { getDevices, getBookings } from '/Users/eazyan/Documents/Our_Lab/our-lab-frontend/src/utils/api.js'; // Для получения данных о приборах и бронированиях

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
  
    const handleBookingSuccess = (startTime, endTime) => {
        alert(`Прибор забронирован с ${startTime} до ${endTime}`);
      
        const selectedDeviceObj = devices.find((device) => device.id === selectedDevice);
      
        if (selectedDeviceObj) {
          // Добавляем бронирование с полными данными
          setBookings([
            ...bookings,
            {
              id: bookings.length + 1,
              deviceId: selectedDevice,
              deviceName: selectedDeviceObj.name,  // Добавляем имя устройства
              startTime,
              endTime,
              status: 'Ожидает подтверждения',  // Статус по умолчанию
            },
          ]);
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
          <BookingHistory bookings={bookings} devices={devices} /> {/* Передаем devices */}
        </div>
      );
      
  };

export default Bookings