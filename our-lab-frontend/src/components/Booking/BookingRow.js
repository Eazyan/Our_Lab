import React from 'react';

const BookingRow = ({ 
  booking, 
  onConfirmBooking, 
  onCancelBooking, 
  onBookingClick 
}) => {
  if (!booking || !booking.startTime || !booking.endTime) {
    return null;
  }
  
  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);
  
  return (
    <div 
      className={`booking-row status-${booking.status === 'Ожидает подтверждения' ? 'pending' : 
        booking.status === 'Подтверждено' ? 'confirmed' : 
        booking.status === 'Отменено' ? 'cancelled' : 
        booking.status === 'Завершено' ? 'completed' : 'pending'}`}
      onClick={() => onBookingClick(booking)}
      style={{ cursor: 'pointer' }}
    >
      <div className="booking-cell device-cell">{booking.deviceName || 'Неизвестное устройство'}</div>
      <div className="booking-cell date-cell">{startTime.toLocaleDateString('ru-RU', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })}</div>
      <div className="booking-cell time-cell">{startTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
      <div className="booking-cell time-cell">{endTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false })}</div>
      <div className="booking-cell status-cell">
        {booking.status === 'Ожидает подтверждения' && 'Ожидание'}
        {booking.status === 'Подтверждено' && 'Подтверждено'}
        {booking.status === 'Отменено' && 'Отменено'}
        {booking.status === 'Завершено' && 'Завершено'}
        {!booking.status && 'Ожидание'}
      </div>
      <div className="booking-cell actions-cell" onClick={(e) => e.stopPropagation()}>
        {booking.status === 'Ожидает подтверждения' && (
          <button 
            onClick={() => onConfirmBooking(booking.id)}
            className="confirm-btn"
          >
            Подтвердить
          </button>
        )}
        {(booking.status === 'Ожидает подтверждения' || booking.status === 'Подтверждено') && (
          <button 
            onClick={() => onCancelBooking(booking.id)}
            className="cancel-btn"
          >
            Отменить
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingRow; 