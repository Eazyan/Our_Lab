import React from 'react';
import './TimelineBookingDetailsModal.css';

const TimelineBookingDetailsModal = ({ booking, onClose, formatTime, formatDate, getStatusText }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Детали бронирования</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="booking-details">
            <div className="detail-row">
              <span className="detail-label">Прибор:</span>
              <span className="detail-value">{booking.deviceName}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Дата:</span>
              <span className="detail-value">{formatDate(booking.startTime || booking.start_time)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Время:</span>
              <span className="detail-value">
                {formatTime(booking.startTime || booking.start_time)} - {formatTime(booking.endTime || booking.end_time)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Статус:</span>
              <span className="detail-value">{getStatusText(booking.status)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineBookingDetailsModal; 