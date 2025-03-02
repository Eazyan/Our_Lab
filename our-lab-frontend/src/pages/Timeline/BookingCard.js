import React from 'react';
import { formatTime, getRandomColor } from './utils';

const BookingCard = ({ booking, bookingStart, bookingEnd }) => {
  // Начало и конец рабочего дня (например, с 8:00 до 17:00)
  const dayStartHour = 8;
  const dayEndHour = 17;

  // Длительность рабочего дня в минутах (с 8:00 до 17:00)
  const dayLengthMinutes = (dayEndHour - dayStartHour) * 60;

  // Время начала и окончания бронирования в минутах от 8:00
  const startHour = bookingStart.getHours();
  const startMinute = bookingStart.getMinutes();
  const endHour = bookingEnd.getHours();
  const endMinute = bookingEnd.getMinutes();

  const startTimeMinutes = (startHour - dayStartHour) * 60 + startMinute;
  const endTimeMinutes = (endHour - dayStartHour) * 60 + endMinute;

  // Рассчитываем длительность бронирования в минутах
  const durationInMinutes = endTimeMinutes - startTimeMinutes;

  // Местоположение карточки на шкале времени (положение верха)
  const topPosition = (startTimeMinutes / dayLengthMinutes) * 100; // Расположить по шкале времени

  // Рассчитываем высоту карточки (400% для 2 часов)
  // Пропорция: для 2 часов = 400%, для 1 часа = 200%, для 30 минут = 100%
  const height = (durationInMinutes / (60 * 2)) * 400;

  // Получаем цвет для карточки на основе устройства
  const backgroundColor = getRandomColor(booking.deviceName);

  return (
    <div
      className="booking-card"
      style={{
        position: 'absolute',
        top: `${topPosition}%`,  // Позиция сверху на шкале времени
        height: `${height}%`,    // Высота пропорциональна длительности
        backgroundColor,        // Цвет карточки
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
