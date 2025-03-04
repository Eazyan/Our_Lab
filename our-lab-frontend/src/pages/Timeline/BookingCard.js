import React from 'react';
import { formatTime, getRandomColor } from './utils';

const BookingCard = ({ booking, bookingStart, bookingEnd }) => {
  const dayStartHour = 8;
  const dayEndHour = 17;

  const dayLengthMinutes = (dayEndHour - dayStartHour) * 60;

  const startHour = bookingStart.getHours();
  const startMinute = bookingStart.getMinutes();
  const endHour = bookingEnd.getHours();
  const endMinute = bookingEnd.getMinutes();

  const startTimeMinutes = (startHour - dayStartHour) * 60 + startMinute;
  const endTimeMinutes = (endHour - dayStartHour) * 60 + endMinute;

  const durationInMinutes = endTimeMinutes - startTimeMinutes;

  const topPosition = (startTimeMinutes / dayLengthMinutes) * 100;
  const height = (durationInMinutes / (60 * 2)) * 400;

  const backgroundColor = getRandomColor(booking.device_name || 'default');

  const deviceStatus = booking.device_available ? "Доступен" : "Не доступен";
  const deviceStatusColor = booking.device_available ? "#4CAF50" : "#F44336";

  return (
    <div
      className="booking-card"
      style={{
        position: 'absolute',
        top: `${topPosition}%`, 
        height: `${height}%`,   
        backgroundColor,        
        borderRadius: '12px',   
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', 
        overflow: 'hidden',     
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div className="booking-card-content" style={{
        padding: '15px',
        color: '#333',   
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}>
        <div style={{
          fontSize: '16px',
          fontWeight: '600',  
          marginBottom: '5px',
        }}>
          {booking.device_name || 'Неизвестный прибор'}
        </div>

        <div style={{
          fontSize: '14px',
          fontWeight: '500',
          color: deviceStatusColor, 
          marginBottom: '10px',
        }}>
          {deviceStatus}
        </div>

        <div style={{
          fontSize: '14px',
          color: '#777',   
          marginBottom: '10px',
        }}>
          {formatTime(bookingStart)} - {formatTime(bookingEnd)}
        </div>

        <div className="booking-status" style={{
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#5e5e5e', 
          padding: '5px 10px', 
          backgroundColor: '#f4f4f4', 
          borderRadius: '8px', 
          textAlign: 'center', 
          marginTop: 'auto',   
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}>
          {booking.status === 'pending' && 'Ожидание'}
          {booking.status === 'confirmed' && 'Подтверждено'}
          {booking.status === 'cancelled' && 'Отменено'}
          {booking.status === 'completed' && 'Завершено'}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
