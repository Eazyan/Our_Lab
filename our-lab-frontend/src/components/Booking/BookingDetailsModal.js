import React from 'react';
import './BookingDetailsModal.css';

const BookingDetailsModal = ({ booking, onClose, onConfirm, onCancel }) => {
  if (!booking) return null;

  const startTime = new Date(booking.startTime);
  const endTime = new Date(booking.endTime);
  const createdAt = new Date(booking.created_at);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>Подробная информация о бронировании</h2>
        
        <div className="booking-details">
          <div className="detail-row">
            <span className="detail-label">Прибор:</span>
            <span className="detail-value">{booking.deviceName}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Дата:</span>
            <span className="detail-value">
              {startTime.toLocaleDateString('ru-RU', { 
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Время:</span>
            <span className="detail-value">
              {startTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false })} - 
              {endTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Статус:</span>
            <span className="detail-value status-value">
              {booking.status === 'Ожидает подтверждения' && 'Ожидание'}
              {booking.status === 'Подтверждено' && 'Подтверждено'}
              {booking.status === 'Отменено' && 'Отменено'}
              {booking.status === 'Завершено' && 'Завершено'}
              {!booking.status && 'Ожидание'}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Email пользователя:</span>
            <span className="detail-value">{booking.userEmail || 'Не указан'}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Создано:</span>
            <span className="detail-value">
              {createdAt.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </span>
          </div>

          <div className="modal-actions">
            {booking.status === 'Ожидает подтверждения' && (
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
            {(booking.status === 'Ожидает подтверждения' || booking.status === 'Подтверждено') && (
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