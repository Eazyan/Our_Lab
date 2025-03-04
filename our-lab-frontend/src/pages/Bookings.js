import React, { useState, useEffect } from 'react';
import { getDevices, getBookings, createBooking, deleteBooking, apiUrl } from '../utils/api.js'; 
import { toast } from 'react-toastify';
import { getToken } from '../utils/auth';
import '../styles/Bookings.css';

const Bookings = () => {
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState("");
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
  
    const fetchBookings = async () => {
      try {
        const bookingsData = await getBookings();
        console.log('Полученные бронирования:', bookingsData);
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch (error) {
        console.error('Ошибка при загрузке бронирований:', error);
        toast.error('Не удалось загрузить бронирования');
        setBookings([]);
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const devicesData = await getDevices();
          setDevices(Array.isArray(devicesData) ? devicesData : []);
          await fetchBookings();
        } catch (error) {
          console.error('Ошибка при загрузке данных:', error);
          toast.error('Не удалось загрузить данные');
          setDevices([]);
          setBookings([]);
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
          deviceId: deviceIdNumber,
          start_time: startTime,
          end_time: endTime
        };
        
        await createBooking(newBooking);
        await fetchBookings();
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
        await deleteBooking(id);
        await fetchBookings();
        toast.success('Бронирование отменено');
      } catch (error) {
        console.error('Ошибка при отмене бронирования:', error);
        toast.error('Не удалось отменить бронирование');
      }
    };

    const handleDeleteBooking = async (id) => {
      try {
        await deleteBooking(id);
        await fetchBookings();
        toast.success('Бронирование удалено');
      } catch (error) {
        console.error('Ошибка при удалении бронирования:', error);
        toast.error('Не удалось удалить бронирование');
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
        <h2>Все бронирования</h2>
        
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
          
          {bookings && bookings.length > 0 ? (
            bookings.map(booking => {
              if (!booking || !booking.start_time || !booking.end_time) {
                return null;
              }
              
              const startTime = new Date(booking.start_time);
              const endTime = new Date(booking.end_time);
              
              return (
                <div key={booking.id} className={`booking-row status-${booking.status || 'pending'}`}>
                  <div className="booking-cell">{booking.deviceName || 'Неизвестное устройство'}</div>
                  <div className="booking-cell">{startTime.toLocaleDateString()}</div>
                  <div className="booking-cell">{startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="booking-cell">{endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className="booking-cell status">
                    {booking.status === 'pending' && 'Ожидание'}
                    {booking.status === 'confirmed' && 'Подтверждено'}
                    {booking.status === 'cancelled' && 'Отменено'}
                    {booking.status === 'completed' && 'Завершено'}
                    {!booking.status && 'Ожидание'}
                  </div>
                  <div className="booking-cell actions">
                    {(booking.status === 'pending' || booking.status === 'confirmed' || !booking.status) && (
                      <button onClick={() => handleCancelBooking(booking.id)}>
                        Отменить
                      </button>
                    )}
                    <button onClick={() => handleDeleteBooking(booking.id)}>
                      Удалить
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bookings-empty">
              <p>Нет бронирований</p>
            </div>
          )}
        </div>
      </div>
    );
};

export default Bookings;
