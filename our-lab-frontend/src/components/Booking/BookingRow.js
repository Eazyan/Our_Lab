import React from 'react';
import './BookingRow.css';

const BookingRow = ({ booking, onConfirm, onCancel, onClick }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    // Получаем время в UTC
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Ожидает подтверждения';
      case 'confirmed':
        return 'Подтверждено';
      case 'cancelled':
        return 'Отменено';
      case 'completed':
        return 'Завершено';
      default:
        return 'Неизвестный статус';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'confirmed':
        return 'status-confirmed';
      case 'cancelled':
        return 'status-cancelled';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`booking-row ${getStatusClass(booking.status)}`}
      onClick={() => onClick(booking)}
    >
      <div className="booking-cell device-cell">
        {booking.device?.name || 'Неизвестное устройство'}
      </div>
      <div className="booking-cell date-cell">
        {formatDate(booking.start_time)}
      </div>
      <div className="booking-cell time-cell">
        {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
      </div>
      <div className="booking-cell status-cell">
        <span className={`status-value ${getStatusClass(booking.status)}`}>
          {getStatusText(booking.status)}
        </span>
      </div>
      <div className="booking-cell actions-cell">
        {booking.status === 'pending' && (
          <>
            <button 
              className="confirm-btn"
              onClick={(e) => {
                e.stopPropagation();
                onConfirm(booking.id);
              }}
            >
              Подтвердить
            </button>
            <button 
              className="cancel-btn"
              onClick={(e) => {
                e.stopPropagation();
                onCancel(booking.id);
              }}
            >
              Отменить
            </button>
          </>
        )}
        {booking.status === 'confirmed' && (
          <button 
            className="cancel-btn"
            onClick={(e) => {
              e.stopPropagation();
              onCancel(booking.id);
            }}
          >
            Отменить
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingRow; 