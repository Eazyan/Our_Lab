import React from 'react';
import './BookingHistory.css';

const BookingHistory = ({ bookings, devices }) => {
  // Функция для форматирования даты
  const formatDate = (dateString) => {
    if (!dateString) return 'Дата не указана';
    
    try {
      const date = new Date(dateString);
      // Проверяем, что дата валидна
      if (isNaN(date.getTime())) {
        console.error('Невалидная дата:', dateString);
        return 'Некорректная дата';
      }
      return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Ошибка при форматировании даты:', error);
      return 'Ошибка даты';
    }
  };

  return (
    <div>
      <h3>История бронирований</h3>
      {bookings.length === 0 ? (
        <p>Нет бронирований</p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => {
            console.log('Данные бронирования:', booking); // Отладочная информация
            const device = devices.find((device) => 
              device.id === booking.deviceId || 
              device.id === booking.device_id
            );
            
            return (
              <div key={booking.id} className="booking-item">
                <div className="booking-device">
                  {booking.deviceName || (device ? device.name : 'Неизвестный прибор')}
                </div>
                <div className="booking-time">
                  {formatDate(booking.startTime || booking.start_time)} - {formatDate(booking.endTime || booking.end_time)}
                </div>
                <div className="booking-status">
                  Статус: <strong>{booking.status}</strong>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
