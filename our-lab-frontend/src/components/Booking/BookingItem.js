import React from 'react';
import './BookingItem.css';

const BookingItem = ({
  booking,
  device,
  showActions,
  canDeleteBookings,
  onConfirm,
  onCancel,
  onDelete,
  onClick,
  formatDate,
  formatTime,
  getStatusText
}) => {
  const isCancelled = booking.status === 'cancelled';
  
  return (
    <div 
      className={`booking-history-item status-${booking.status} ${isCancelled ? 'available-slot' : ''}`}
      onClick={() => onClick(booking)}
    >
      <div className="booking-history-info">
        <div className="booking-history-device">
          {booking.deviceName || (device ? device.name : 'Неизвестный прибор')}
        </div>
        <div className="booking-history-time">
          {formatDate(booking.startTime || booking.start_time)} {formatTime(booking.startTime || booking.start_time)} - {formatTime(booking.endTime || booking.end_time)}
        </div>
        <div className="booking-history-user">
          <strong>Email:</strong> {booking.userEmail || 'Неизвестный пользователь'}
        </div>
        <div className="booking-history-status">
          Статус: <strong>{getStatusText(booking.status)}</strong>
          {isCancelled && <span className="available-slot-text"> (Доступно для бронирования)</span>}
        </div>
      </div>
      {showActions && (
        <div className="booking-history-actions">
          {booking.status === 'pending' && (
            <>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onConfirm(booking.id);
                }}
                className="history-confirm-button"
              >
                Подтвердить
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel(booking.id);
                }}
                className="history-cancel-button"
              >
                Отменить
              </button>
            </>
          )}
          {canDeleteBookings && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(booking.id);
              }}
              className="history-delete-button"
            >
              Удалить
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingItem; 