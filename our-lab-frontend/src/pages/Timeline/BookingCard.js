import React, { useState } from 'react';
import TimelineBookingDetailsModal from './TimelineBookingDetailsModal';
import { formatTime, formatDate, getStatusText } from './timeUtils';
import { getRandomColor } from './utils';
import './BookingCard.css';

const BookingCard = ({ booking, bookingStart, bookingEnd }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const startHour = bookingStart.getHours();
  const startMinute = bookingStart.getMinutes();
  const endHour = bookingEnd.getHours();
  const endMinute = bookingEnd.getMinutes();

  const totalSlots = 19; 
  const startSlot = ((startHour - 8) * 2) + (startMinute / 30);
  const endSlot = ((endHour - 8) * 2) + (endMinute / 30);

  const topPosition = (startSlot / totalSlots) * 100;
  const height = ((endSlot - startSlot) / totalSlots) * 100;

  const baseColor = getRandomColor(booking.deviceName || booking.device?.name || 'default');
  const backgroundColor = baseColor.replace(')', isHovered ? ', 1)' : ', 0.5)');

  const formattedBooking = {
    ...booking,
    deviceName: booking.deviceName || booking.device?.name || 'Неизвестный прибор',
    startTime: bookingStart.toISOString(),
    endTime: bookingEnd.toISOString(),
    status: booking.status || 'pending'
  };

  return (
    <>
      <div
        className="booking-card"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowModal(true)}
        style={{
          top: `${topPosition}%`,
          height: `${height}%`,
          backgroundColor,
          width: '90%',
          left: '5%'
        }}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          width: '100%'
        }}>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            flex: 1,
            marginRight: '8px'
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
              {formattedBooking.deviceName}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>
              {getStatusText(formattedBooking.status)}
            </div>
          </div>
          <div style={{ fontSize: '16px', color: '#000', whiteSpace: 'nowrap' }}>
            {formatTime(bookingStart)} - {formatTime(bookingEnd)}
          </div>
        </div>
      </div>

      {showModal && (
        <TimelineBookingDetailsModal
          booking={formattedBooking}
          onClose={() => setShowModal(false)}
          formatTime={formatTime}
          formatDate={formatDate}
          getStatusText={getStatusText}
        />
      )}
    </>
  );
};

export default BookingCard;
