import React from 'react';
import { formatTime, getRandomColor } from './utils';

const BookingCard = ({ booking, bookingStart, bookingEnd }) => {
  const workdayStart = new Date(bookingStart);
  workdayStart.setHours(8, 0, 0, 0);
  const workdayEnd = new Date(bookingStart);
  workdayEnd.setHours(20, 0, 0, 0);
  const workdayDuration = workdayEnd - workdayStart;

  const topPosition = ((bookingStart - workdayStart) / workdayDuration) * 100;
  const height = ((bookingEnd - bookingStart) / workdayDuration) * 100;

  const backgroundColor = getRandomColor(booking.deviceName || 'default');

  return (
    <div
      className="booking-card"
      style={{
        position: 'absolute',
        top: `${topPosition}%`,
        height: `${height}%`,
        backgroundColor,
        width: '90%',
        left: '5%',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        zIndex: 3
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
        {booking.deviceName || 'Неизвестный прибор'}
      </div>
      
      <div style={{ fontSize: '12px', color: '#666' }}>
        {formatTime(bookingStart)} - {formatTime(bookingEnd)}
      </div>
    </div>
  );
};

export default BookingCard;
