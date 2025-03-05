import React, { useState, useEffect, useCallback } from 'react';
import BookingRow from './BookingRow';
import './BookingList.css';
import { exportBookingsToExcel } from '../../utils/excelExport';

const BookingList = ({ 
  bookings, 
  devices, 
  onConfirmBooking, 
  onCancelBooking, 
  onBookingClick,
  onExportToExcel 
}) => {
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const localHours = (date.getUTCHours() + 3).toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${localHours}:${minutes}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
        return 'Неизвестный статус';
    }
  };

  const handleExportToExcel = useCallback(() => {
    exportBookingsToExcel(bookings, devices, formatDate, formatTime, getStatusText);
  }, [bookings, devices]);

  useEffect(() => {
    if (onExportToExcel) {
      onExportToExcel(() => handleExportToExcel);
    }
  }, [handleExportToExcel, onExportToExcel]);

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bookings-empty">
        <p>Нет бронирований</p>
      </div>
    );
  }

  return (
    <div className="bookings-table">
      <div className="bookings-header">
        <div className="booking-cell device-cell">Прибор</div>
        <div className="booking-cell date-cell">Дата</div>
        <div className="booking-cell time-cell">Время</div>
        <div className="booking-cell status-cell">Статус</div>
        <div className="booking-cell actions-cell">Действия</div>
      </div>
      
      {bookings.map(booking => (
        <BookingRow
          key={booking.id}
          booking={booking}
          onConfirm={onConfirmBooking}
          onCancel={onCancelBooking}
          onClick={onBookingClick}
        />
      ))}
    </div>
  );
};

export default BookingList; 