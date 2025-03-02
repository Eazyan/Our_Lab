import React from 'react';
import { formatTime, getRandomColor } from './utils';

const BookingCard = ({ booking, bookingStart, bookingEnd }) => {
  // Начало и конец рабочего дня (8:00 - 17:00)
  const dayStartHour = 8;
  const dayEndHour = 17;

  // Длительность дня в минутах (с 8:00 до 17:00)
  const dayLengthMinutes = (dayEndHour - dayStartHour) * 60;

  // Время начала и окончания бронирования в минутах от 8:00
  const startHour = bookingStart.getHours();
  const startMinute = bookingStart.getMinutes();
  const endHour = bookingEnd.getHours();
  const endMinute = bookingEnd.getMinutes();

  const startTimeMinutes = (startHour - dayStartHour) * 60 + startMinute;
  const endTimeMinutes = (endHour - dayStartHour) * 60 + endMinute;

  // Рассчитываем позицию карточки по оси Y (в процентах)
  const top = (startTimeMinutes / dayLengthMinutes) * 100;

  // Рассчитываем высоту карточки (в процентах) — разница между временем начала и окончания
  const height = ((endTimeMinutes - startTimeMinutes) / dayLengthMinutes) * 100;

  // Получаем цвет для карточки
  const backgroundColor = getRandomColor(booking.deviceName);

  return (
    <div
      className="booking-card"
      style={{
        top: `${top}%`, // Позиция сверху
        height: `${height}%`, // Высота карточки
        backgroundColor, // Цвет карточки
      }}
    >
      <div className="booking-card-content">
        <div><strong>{booking.deviceName}</strong></div>
        <div>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</div>
        <div className="booking-status">{booking.status}</div>
      </div>
    </div>
  );
};

export default BookingCard;
