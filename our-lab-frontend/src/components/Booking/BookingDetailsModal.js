import React from 'react';
import './BookingDetailsModal.css';

const BookingDetailsModal = ({ booking, onClose, onConfirm, onCancel }) => {
  if (!booking) return null;

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    // Преобразуем UTC в локальное время (MSK)
    const localHours = (date.getUTCHours()).toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${localHours}:${minutes}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatCreatedDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }) + ', ' + date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
        return 'Ожидает подтверждения';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Подробная информация о бронировании</h2>
        
        <div className="booking-details">
          <div className="detail-row">
            <span className="detail-label">Прибор:</span>
            <span className="detail-value">{booking.device?.name || booking.deviceName || 'Не указан'}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Дата:</span>
            <span className="detail-value">{formatDate(booking.start_time || booking.startTime)}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Время:</span>
            <span className="detail-value">
              {formatTime(booking.start_time || booking.startTime)} - {formatTime(booking.end_time || booking.endTime)}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Статус:</span>
            <span className="detail-value status-value">
              {getStatusText(booking.status)}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Email пользователя:</span>
            <span className="detail-value">{booking.userEmail || 'Не указан'}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Создано:</span>
            <span className="detail-value">
              {formatCreatedDate(booking.created_at || booking.createdAt)}
            </span>
          </div>

          <div className="modal-actions">
            {booking.status === 'pending' && (
              <button 
                className="confirm-button"
                onClick={() => {
                  onConfirm(booking.id);
                  onClose();
                }}
              >
                Подтвердить
              </button>
            )}
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <button 
                className="cancel-button"
                onClick={() => {
                  onCancel(booking.id);
                  onClose();
                }}
              >
                Отменить
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal; 