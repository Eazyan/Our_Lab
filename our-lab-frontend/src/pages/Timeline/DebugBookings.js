import React from 'react';
import { formatDate, formatTime } from './utils';

const DebugBookings = ({ bookings }) => {
  return (
    <div className="debug-bookings">
      <h3>Отладка: Все бронирования ({bookings.length})</h3>
      {bookings.length === 0 ? (
        <p>Нет бронирований</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>
              {booking.deviceName || 'Неизвестное устройство'} - 
              {formatDate(new Date(booking.startTime))} 
              {formatTime(booking.startTime)} - 
              {formatTime(booking.endTime)} 
              (Статус: {booking.status})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DebugBookings; 