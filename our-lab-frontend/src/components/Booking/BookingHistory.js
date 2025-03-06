import React, { useState, useEffect } from 'react';
import { getUserRole } from '../../utils/auth';
import BookingFilters from './BookingFilters';
import BookingItem from './BookingItem';
import BookingDetailsModal from './BookingDetailsModal';
import { exportBookingsToExcel } from '../../utils/excelExport';
import jwtDecode from 'jwt-decode';
import './styles/layout.css';
import './styles/booking-item.css';
import './styles/modal.css';
import './styles/actions.css';

const BookingHistory = ({ bookings, devices, onCancel, onConfirm, onDelete }) => {
  const [showOnlyMine, setShowOnlyMine] = useState(false);
  const [showOnlyToday, setShowOnlyToday] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDevices, setSelectedDevices] = useState([]);
  const userRole = getUserRole();
  const token = document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];
  const userEmail = token ? jwtDecode(token).sub : null;

  useEffect(() => {
    if (devices && devices.length > 0) {
      setSelectedDevices(devices.map(device => device.id));
    }
  }, [devices]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Дата не указана';
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
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
        
        hours = (hours) % 24;
        
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

  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const handleDeviceChange = (deviceId) => {
    if (selectedDevices.includes(deviceId)) {
      setSelectedDevices(selectedDevices.filter(id => id !== deviceId));
    } else {
      setSelectedDevices([...selectedDevices, deviceId]);
    }
  };

  const handleSelectAllDevices = () => {
    if (selectedDevices.length === devices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(devices.map(device => device.id));
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const deviceId = booking.deviceId || booking.device_id;
    const bookingEmail = booking.userEmail || booking.user_email;
    
    // Проверка устройства
    if (selectedDevices.length > 0 && !selectedDevices.includes(deviceId)) {
      return false;
    }
    
    // Проверка email
    if (showOnlyMine && bookingEmail !== userEmail) {
      return false;
    }
    
    // Проверка даты
    if (showOnlyToday && !isToday(booking.startTime || booking.start_time)) {
      return false;
    }
    
    // Проверка статуса
    if (filterStatus !== 'all' && booking.status !== filterStatus) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Приоритеты статусов
    const statusPriority = {
      'pending': 0,    // Самый высокий приоритет
      'confirmed': 1,  // Средний приоритет
      'cancelled': 2,  // Низкий приоритет
      'completed': 3   // Самый низкий приоритет
    };

    // Сначала сортируем по статусу
    if (statusPriority[a.status] !== statusPriority[b.status]) {
      return statusPriority[a.status] - statusPriority[b.status];
    }

    // Если статусы одинаковые, сортируем по дате
    const dateA = new Date(a.startTime || a.start_time);
    const dateB = new Date(b.startTime || b.start_time);
    return dateA - dateB;
  });

  const canManageBookings = userRole === 'teacher' || userRole === 'admin';
  const canDeleteBookings = userRole === 'admin';
  const isStudent = userRole === 'student';

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
  };

  const closeDetails = () => {
    setSelectedBooking(null);
  };

  return (
    <div className="booking-history">
      <div className="booking-history-header">
        <h3>История бронирований</h3>
        <BookingFilters
          showOnlyMine={showOnlyMine}
          setShowOnlyMine={setShowOnlyMine}
          showOnlyToday={showOnlyToday}
          setShowOnlyToday={setShowOnlyToday}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          devices={devices}
          selectedDevices={selectedDevices}
          handleDeviceChange={handleDeviceChange}
          handleSelectAllDevices={handleSelectAllDevices}
          canManageBookings={canManageBookings}
          handleExportToExcel={handleExportToExcel}
        />
      </div>

      {filteredBookings.length === 0 ? (
        <p className="no-history-bookings">Нет бронирований</p>
      ) : (
        <div className="booking-history-list">
          {filteredBookings.map((booking) => {
            const device = devices.find((device) => 
              device.id === booking.deviceId || 
              device.id === booking.device_id
            );
            
            const showActions = !isStudent && (
              (userRole === 'admin') ||
              (userRole === 'teacher' && booking.userEmail !== userEmail)
            );

            return (
              <BookingItem
                key={booking.id}
                booking={booking}
                device={device}
                showActions={showActions}
                canDeleteBookings={canDeleteBookings}
                onConfirm={onConfirm}
                onCancel={onCancel}
                onDelete={onDelete}
                onClick={handleBookingClick}
                formatDate={formatDate}
                formatTime={formatTime}
                getStatusText={getStatusText}
              />
            );
          })}
        </div>
      )}

      {selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={closeDetails}
          formatDate={formatDate}
          formatTime={formatTime}
          getStatusText={getStatusText}
        />
      )}
    </div>
  );
};

export default BookingHistory;
