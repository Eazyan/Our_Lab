import React, { useState } from 'react';
import './BookingHistory.css';
import { exportBookingsToExcel } from '../../utils/excelExport';

const BookingHistory = ({ bookings, devices, onCancel, onConfirm }) => {
  const [sortBy, setSortBy] = useState('pending');
  const [showOnlyConfirmed, setShowOnlyConfirmed] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return 'Дата не указана';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        console.error('Невалидная дата:', dateString);
        return 'Некорректная дата';
      }
      
      const formatter = new Intl.DateTimeFormat('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return formatter.format(date);
    } catch (error) {
      console.error('Ошибка при форматировании даты:', error);
      return 'Ошибка даты';
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Время не указано';
    
    try {
      const timeMatch = dateString.match(/T(\d{2}):(\d{2})/);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2];
        
        hours = (hours + 10) % 24;
        
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
      }
      return 'Некорректное время';
    } catch (error) {
      console.error('Ошибка при форматировании времени:', error);
      return 'Ошибка времени';
    }
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

  const handleExportToExcel = () => {
    exportBookingsToExcel(bookings, devices, formatDate, formatTime, getStatusText);
  };

  const filteredAndSortedBookings = bookings
    .filter(booking => {
      if (showOnlyConfirmed) {
        return booking.status === 'confirmed';
      }
      if (sortBy === 'all') {
        return true;
      }
      if (sortBy === 'all_pending') {
        return booking.status === 'pending';
      }
      return booking.status === sortBy;
    })
    .sort((a, b) => {
      if (sortBy === 'all') return 0;
      if (sortBy === 'all_pending') return 0;
      if (a.status === sortBy && b.status !== sortBy) return -1;
      if (a.status !== sortBy && b.status === sortBy) return 1;
      return 0;
    });

  return (
    <div>
      <div className="booking-header">
        <h3>История бронирований</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <input
                type="checkbox"
                checked={showOnlyConfirmed}
                onChange={(e) => setShowOnlyConfirmed(e.target.checked)}
              />
              Только подтверждённые
            </label>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`filter-button ${sortBy === 'all' ? 'active' : ''}`}
              onClick={() => setSortBy('all')}
            >
              Все
            </button>
            <button
              className={`filter-button ${sortBy === 'all_pending' ? 'active' : ''}`}
              onClick={() => setSortBy('all_pending')}
            >
              Все ожидающие
            </button>
            <button
              className={`filter-button ${sortBy === 'confirmed' ? 'active' : ''}`}
              onClick={() => setSortBy('confirmed')}
            >
              Подтверждено
            </button>
            <button
              className={`filter-button ${sortBy === 'cancelled' ? 'active' : ''}`}
              onClick={() => setSortBy('cancelled')}
            >
              Отменено
            </button>
            <button
              className={`filter-button ${sortBy === 'completed' ? 'active' : ''}`}
              onClick={() => setSortBy('completed')}
            >
              Завершено
            </button>
          </div>
          <button 
            onClick={handleExportToExcel}
            className="export-button"
          >
            Выгрузить в Excel
          </button>
        </div>
      </div>
      {filteredAndSortedBookings.length === 0 ? (
        <p>Нет бронирований</p>
      ) : (
        <div className="booking-list">
          {filteredAndSortedBookings.map((booking) => {
            const device = devices.find((device) => 
              device.id === booking.deviceId || 
              device.id === booking.device_id
            );
            
            return (
              <div key={booking.id} className="booking-item">
                <div className="booking-info">
                  <div className="booking-device">
                    {booking.deviceName || (device ? device.name : 'Неизвестный прибор')}
                  </div>
                  <div className="booking-time">
                    {formatDate(booking.startTime || booking.start_time)} {formatTime(booking.startTime || booking.start_time)} - {formatTime(booking.endTime || booking.end_time)}
                  </div>
                  <div className="booking-status">
                    Статус: <strong>{getStatusText(booking.status)}</strong>
                  </div>
                </div>
                <div className="booking-actions">
                  {booking.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => onConfirm(booking.id)}
                        className="confirm-button"
                      >
                        Подтвердить
                      </button>
                      <button 
                        onClick={() => onCancel(booking.id)}
                        className="cancel-button"
                      >
                        Отменить
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
