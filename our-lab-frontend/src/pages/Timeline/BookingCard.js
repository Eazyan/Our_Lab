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
  const height = (durationInMinutes / (60 * 2)) * 400;

  // Получаем цвет для карточки на основе устройства
  const backgroundColor = getRandomColor(booking.deviceName);

  // Определяем доступность устройства
  const deviceStatus = booking.deviceAvailable ? "Доступен" : "Не доступен";
  const deviceStatusColor = booking.deviceAvailable ? "#4CAF50" : "#F44336"; // Зеленый для доступного, красный для недоступного

  return (
    <div
      className="booking-card"
      style={{
        position: 'absolute',
        top: `${topPosition}%`,  // Позиция сверху на шкале времени
        height: `${height}%`,    // Высота пропорциональна длительности
        backgroundColor,        // Цвет карточки
        borderRadius: '12px',    // Скругленные углы
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Легкая тень
        overflow: 'hidden',      // Чтобы контент не выходил за пределы
        transition: 'all 0.3s ease', // Плавные анимации
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="booking-card-content" style={{
        padding: '15px',
        color: '#333',   // Тёмный текст для контраста
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}>
        {/* Имя устройства */}
        <div style={{
          fontSize: '16px',
          fontWeight: '600',   // Чуть жирнее для имени устройства
          marginBottom: '5px',
        }}>
          {booking.deviceName}
        </div>

        {/* Статус доступности устройства */}
        <div style={{
          fontSize: '14px',
          fontWeight: '500',
          color: deviceStatusColor,  // Зеленый или красный цвет для доступности
          marginBottom: '10px',
        }}>
          {deviceStatus}
        </div>

        {/* Время бронирования */}
        <div style={{
          fontSize: '14px',
          color: '#777',   // Мягкий серый для времени
          marginBottom: '10px',
        }}>
          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
        </div>

        {/* Статус бронирования */}
        <div className="booking-status" style={{
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#5e5e5e', 
          padding: '5px 10px', 
          backgroundColor: '#f4f4f4', 
          borderRadius: '8px', 
          textAlign: 'center', 
          marginTop: 'auto',   // Размещаем статус внизу карточки
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          {booking.status}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
