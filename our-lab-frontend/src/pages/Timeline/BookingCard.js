import React from 'react';
import { formatTime, getRandomColor } from './utils';

const BookingCard = ({ booking, bookingStart, bookingEnd }) => {
  // Calculate position and styling for the booking card
  const startHour = bookingStart.getHours();
  const startMinute = bookingStart.getMinutes();
  const endHour = bookingEnd.getHours();
  const endMinute = bookingEnd.getMinutes();
  
  // Calculate position as percentage of the day (assuming 8:00 - 23:00 timeline)
  const dayStartHour = 8;
  const dayEndHour = 23;
  const dayLengthMinutes = (dayEndHour - dayStartHour) * 60;
  
  const startTimeMinutes = (startHour - dayStartHour) * 60 + startMinute;
  const endTimeMinutes = (endHour - dayStartHour) * 60 + endMinute;
  
  const top = (startTimeMinutes / dayLengthMinutes) * 100;
  const height = ((endTimeMinutes - startTimeMinutes) / dayLengthMinutes) * 100;
  
  // Get color based on device name
  const backgroundColor = getRandomColor(booking.deviceName);
  
  return (
    <div 
      className="booking-card" 
      style={{ 
        top: `${top}%`, 
        height: `${height}%`, 
        backgroundColor 
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