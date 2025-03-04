import React, { useState, useEffect } from 'react';
import { getDevices, getBookings, apiUrl } from '../utils/api.js'; 
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../utils/auth';

const Bookings = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("");
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const devicesResponse = await getDevices();
          setDevices(devicesResponse.data);
          
          const bookingsResponse = await getBookings(); 
          setBookings(bookingsResponse.data);
        } catch (error) {
          console.error('Ошибка при загрузке данных:', error);
          toast.error('Не удалось загрузить данные');
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }, []);
  
    const handleDeviceChange = (e) => {
      setSelectedDevice(e.target.value);
    };

    const handleBookingSuccess = async (startTime, endTime) => {
      if (!selectedDevice) {
        toast.error("Выберите прибор для бронирования");
        return;
      }
      
      try {
        const deviceIdNumber = parseInt(selectedDevice, 10);
        
        if (isNaN(deviceIdNumber)) {
          toast.error("Некорректный ID прибора");
          return;
        }
        
        const selectedDeviceObj = devices.find((device) => device.id === deviceIdNumber);
        
        if (!selectedDeviceObj) {
          toast.error(`Прибор с ID ${deviceIdNumber} не найден`);
          return;
        }
        
        const newBooking = {
          device_id: deviceIdNumber,
          start_time: startTime,
          end_time: endTime
        };
        
        const token = getToken();
        const response = await axios.post(`${apiUrl}/bookings`, newBooking, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });
        
        const bookingForFrontend = {
          id: response.data.id,
          device_id: response.data.device_id,
          device_name: selectedDeviceObj.name,
          start_time: response.data.start_time,
          end_time: response.data.end_time,
          status: response.data.status || 'pending'
        };
        
        setBookings((prevBookings) => [...prevBookings, bookingForFrontend]);
        setShowForm(false);
        toast.success('Бронирование успешно создано!');
      } catch (error) {
        console.error('Ошибка при создании бронирования:', error);
        
        if (error.response) {
          toast.error(`Ошибка: ${error.response.data?.detail || error.message}`);
        } else {
          toast.error(`Ошибка: ${error.message}`);
        }
      }
    };
      
    const handleCancelBooking = async (id) => {
      try {
        const token = getToken();
        await axios.delete(`${apiUrl}/bookings/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          withCredentials: true
        });
        
        setBookings(bookings.filter(booking => booking.id !== id));
        toast.success('Бронирование отменено');
      } catch (error) {
        console.error('Ошибка при отмене бронирования:', error);
        toast.error('Не удалось отменить бронирование');
      }
    };
  
    if (isLoading) {
      return (
        <div className="bookings-container loading">
          <p>Загрузка бронирований...</p>
        </div>
      );
    }
  
    return (
      <div className="bookings-container">
        <h2>Мои бронирования</h2>
        
        <div className="bookings-actions">
          <button 
            className="create-booking-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Отменить' : 'Создать бронирование'}
          </button>
        </div>
        
        {showForm && (
          <div className="booking-form">
            <h3>Новое бронирование</h3>
            <div className="form-group">
              <label>Выберите прибор:</label>
              <select 
                value={selectedDevice} 
                onChange={handleDeviceChange}
              >
                <option value="">-- Выберите прибор --</option>
                {devices.map(device => (
                  <option key={device.id} value={device.id}>
                    {device.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Дата и время начала:</label>
              <input 
                type="datetime-local" 
                id="start-time"
              />
            </div>
            
            <div className="form-group">
              <label>Дата и время окончания:</label>
              <input 
                type="datetime-local" 
                id="end-time"
              />
            </div>
            
            <button 
              onClick={() => {
                const startTime = document.getElementById('start-time').value;
                const endTime = document.getElementById('end-time').value;
                
                if (!startTime || !endTime) {
                  toast.error('Укажите время начала и окончания');
                  return;
                }
                
                handleBookingSuccess(startTime, endTime);
              }}
            >
              Забронировать
            </button>
          </div>
        )}
        
        <div className="bookings-table">
          <div className="bookings-header">
            <div className="booking-cell">Прибор</div>
            <div className="booking-cell">Дата</div>
            <div className="booking-cell">Начало</div>
            <div className="booking-cell">Окончание</div>
            <div className="booking-cell">Статус</div>
            <div className="booking-cell">Действия</div>
          </div>
          
          {bookings.length > 0 ? (
            bookings.map(booking => (
              <div key={booking.id} className={`booking-row status-${booking.status}`}>
                <div className="booking-cell">{booking.device_name}</div>
                <div className="booking-cell">{booking.start_time.split('T')[0]}</div>
                <div className="booking-cell">{booking.start_time.split('T')[1].substring(0, 5)}</div>
                <div className="booking-cell">{booking.end_time.split('T')[1].substring(0, 5)}</div>
                <div className="booking-cell status">
                  {booking.status === 'pending' && 'Ожидание'}
                  {booking.status === 'confirmed' && 'Подтверждено'}
                  {booking.status === 'cancelled' && 'Отменено'}
                  {booking.status === 'completed' && 'Завершено'}
                </div>
                <div className="booking-cell actions">
                  {(booking.status === 'pending' || booking.status === 'confirmed') && (
                    <button onClick={() => handleCancelBooking(booking.id)}>
                      Отменить
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bookings-empty">
              <p>У вас нет активных бронирований</p>
            </div>
          )}
        </div>
      </div>
    );
};

export default Bookings;
