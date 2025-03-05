import React from 'react';
import './BookingDetailsModal.css';

const BookingDetailsModal = ({
  booking,
  onClose,
  formatDate,
  formatTime,
  getStatusText
}) => {
  return (
    <div className="booking-details-modal" onClick={onClose}>
      <div className="booking-details-content" onClick={e => e.stopPropagation()}>
        <h4>Подробная информация о бронировании</h4>
        <div className="booking-details-info">
          <p><strong>Устройство:</strong> {booking.deviceName}</p>
          <p><strong>Дата:</strong> {formatDate(booking.startTime || booking.start_time)}</p>
          <p><strong>Время:</strong> {formatTime(booking.startTime || booking.start_time)} - {formatTime(booking.endTime || booking.end_time)}</p>
          <p><strong>Пользователь:</strong> {booking.userName}</p>
          <p><strong>Email:</strong> {booking.userEmail}</p>
          <p><strong>Статус:</strong> {getStatusText(booking.status)}</p>
          {booking.comment && (
            <p><strong>Комментарий:</strong> {booking.comment}</p>
          )}
        </div>
        <button className="close-details-button" onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default BookingDetailsModal; 