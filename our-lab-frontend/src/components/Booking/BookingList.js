import React from 'react';
import { toast } from 'react-toastify';
import BookingRow from './BookingRow';
import './BookingList.css';
import * as XLSX from 'xlsx';

const BookingList = ({ 
  bookings, 
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

  const handleExportToExcel = () => {
    try {
      
      const data = bookings.map(booking => {
        const normalizedStatus = (booking.status || '').toString().toLowerCase().trim();
        const email = booking.userEmail || 'Не указан';
        
        return {
          'Прибор': booking.device?.name || booking.deviceName || 'Не указан',
          'Дата': formatDate(booking.start_time || booking.startTime),
          'Время': `${formatTime(booking.start_time || booking.startTime)} - ${formatTime(booking.end_time || booking.endTime)}`,
          'Статус': getStatusText(normalizedStatus),
          'Email пользователя': email,
          'Создано': formatCreatedDate(booking.created_at || booking.createdAt)
        };
      });


      const ws = XLSX.utils.json_to_sheet(data);
      
      const colWidths = [
        { wch: 25 }, // Прибор
        { wch: 20 }, // Дата
        { wch: 20 }, // Время
        { wch: 25 }, // Статус
        { wch: 35 }, // Email
        { wch: 20 }  // Создано
      ];
      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Бронирования');
      XLSX.writeFile(wb, 'Бронирования.xlsx');
    } catch (error) {
      console.error('Ошибка при экспорте в Excel:', error);
      toast.error('Ошибка при экспорте в Excel');
    }
  };

  React.useEffect(() => {
    if (onExportToExcel) {
      onExportToExcel(() => handleExportToExcel);
    }
  }, [onExportToExcel]);

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