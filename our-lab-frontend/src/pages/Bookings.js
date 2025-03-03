import React, { useState, useEffect } from 'react';
import BookingForm from '../components/Booking/BookingForm';
import BookingHistory from '../components/Booking/BookingHistory';
import { getDevices, getBookings, apiUrl } from '../utils/api.js'; 
import axios from 'axios';
import { toast } from 'react-toastify';

const Bookings = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("");
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const devicesData = await getDevices();
          setDevices(devicesData);
          const bookingsData = await getBookings(); 
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
        const deviceIdNumber = parseInt(selectedDevice, 10);
        
        if (isNaN(deviceIdNumber)) {
          toast.error("Некорректный ID прибора");
          return;
        }
        
        const selectedDeviceObj = devices.find((device) => device.id === deviceIdNumber);
        
        console.log("Доступные приборы:", devices);
        console.log("Искомый ID прибора:", deviceIdNumber);
        console.log("Найденный прибор:", selectedDeviceObj);
        
        if (!selectedDeviceObj) {
          toast.error(`Прибор с ID ${deviceIdNumber} не найден`);
          return;
        }
        
        console.log("Оригинальное время (ISO):", { startTime, endTime });
        console.log("Часовой пояс клиента: UTC" + new Date().getTimezoneOffset() / -60);
        
        const newBooking = {
          device_id: deviceIdNumber,
          start_time: startTime,
          end_time: endTime,
          status: 'Ожидает подтверждения',
        };
        
        console.log("Отправляем запрос на создание бронирования:", newBooking);
        
        const response = await axios.post(`${apiUrl}/bookings`, newBooking);
        
        console.log("Ответ от сервера:", response.data);
        
        const bookingForFrontend = {
          id: response.data.id,
          deviceId: response.data.device_id,
          deviceName: selectedDeviceObj.name,
          startTime: response.data.start_time,
          endTime: response.data.end_time,
          status: response.data.status
        };
        
        setBookings((prevBookings) => [
          ...prevBookings,
          bookingForFrontend,
        ]);
        
        toast.success('Бронирование успешно создано!');
      } catch (error) {
        console.error('Ошибка при создании бронирования:', error);
        
        if (error.response) {
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
          <BookingHistory bookings={bookings} devices={devices} />
        </div>
      );
};

export default Bookings;
