import React, { useState, useEffect } from 'react';
import './Timeline.css';
<<<<<<< HEAD
import { getBookings } from '/Users/eazyan/Documents/Our_Lab/our-lab-frontend/src/utils/api.js'; // Для получения бронирований
=======
import { getBookings } from '../utils/api.js';
>>>>>>> origin/main

const Timeline = () => {
  const startTime = 8;  // Начало времени (8:00)
  const endTime = 23;   // Конец времени (23:00)
  const timeSlots = [];

  // Генерация временных слотов с шагом 30 минут
  for (let i = startTime; i <= endTime; i++) {
    timeSlots.push(`${i}:00`, `${i}:30`);
  }

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD

  // Загружаем бронирования
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookingsData = await getBookings();
        setBookings(bookingsData);
      } catch (error) {
        console.error('Ошибка при загрузке бронирований:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="timeline">
      <div className="timeline-header">
        <div className="timeline-time-slot"></div>
        <div className="timeline-date">
          <strong>2025-03-05</strong>
        </div>
=======
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);

  // Форматирование даты для отображения
  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
  };

  // Форматирование времени для отображения
  const formatTime = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.error('Недопустимая дата для форматирования:', dateString);
        return 'Некорректное время';
      }
      return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Ошибка при форматировании времени:', error);
      return 'Ошибка времени';
    }
  };

  // Функция для перехода на следующий день
  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  // Функция для перехода на предыдущий день
  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  // Обработчик изменения даты через календарь
  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setSelectedDate(newDate);
  };

  // Загружаем бронирования при изменении даты или при первой загрузке
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const bookingsData = await getBookings();
        console.log('Загруженные бронирования:', bookingsData);
        
        // Преобразуем данные бронирований, если необходимо
        const processedBookings = bookingsData.map(booking => {
          return {
            ...booking,
            // Если deviceName хранится как строка 'string', заменим его
            deviceName: booking.deviceName === 'string' ? 'Устройство' : (booking.deviceName || booking.device_name || 'Устройство'),
            // Убедимся, что у нас есть правильные поля для дат
            startTime: booking.startTime || booking.start_time,
            endTime: booking.endTime || booking.end_time,
            status: booking.status || 'Ожидает подтверждения'
          };
        });
        
        setBookings(processedBookings || []);
      } catch (error) {
        console.error('Ошибка при загрузке бронирований:', error);
        setError('Не удалось загрузить бронирования. Пожалуйста, попробуйте позже.');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [selectedDate]);

  // Форматируем дату для input type="date"
  const dateForInput = selectedDate.toISOString().split('T')[0];

  // Проверяем совпадение дат (без учета времени)
  const isSameDay = (date1, date2) => {
    if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
      console.error('isSameDay получил не Date объекты:', date1, date2);
      return false;
    }
    
    if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
      console.error('isSameDay получил невалидные даты:', date1, date2);
      return false; 
    }
    
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Фильтруем бронирования на выбранную дату
  const getFilteredBookings = () => {
    if (!Array.isArray(bookings)) {
      return [];
    }
    
    return bookings.filter(booking => {
      if (!booking.startTime) return false;
      
      try {
        const bookingDate = new Date(booking.startTime);
        if (isNaN(bookingDate.getTime())) return false;
        return isSameDay(bookingDate, selectedDate);
      } catch (error) {
        return false;
      }
    });
  };

  const filteredBookings = getFilteredBookings();

  // Функция для генерации цвета на основе имени устройства
  const getRandomColor = (deviceName) => {
    let hash = 0;
    for (let i = 0; i < deviceName.length; i++) {
      hash = deviceName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 65%)`;
  };

  // Встроенные компоненты (вместо импорта)
  
  // Компонент управления временной шкалой
  const TimelineControls = () => {
    return (
      <div className="timeline-controls">
        <button onClick={goToPreviousDay} className="control-button">
          &lt; Предыдущий день
        </button>
        
        <div className="date-selector">
          <input 
            type="date" 
            value={dateForInput}
            onChange={handleDateChange}
            className="date-input"
          />
          <h2>{formatDate(selectedDate)}</h2>
        </div>
        
        <button onClick={goToNextDay} className="control-button">
          Следующий день &gt;
        </button>
>>>>>>> origin/main
      </div>
    );
  };

<<<<<<< HEAD
      <div className="timeline-body">
        {timeSlots.map((slot, index) => (
          <div key={slot} className="timeline-row">
            <div className="timeline-time">{slot}</div>
            <div className="timeline-cell">
              {/* Отображаем все бронирования, начинающиеся с этого временного слота */}
              {bookings.map((booking) => {
                const bookingStart = new Date(booking.startTime);
                const bookingEnd = new Date(booking.endTime);

                // Проверяем, попадает ли текущее время в диапазон этого бронирования
                if (index === ((bookingStart.getHours() - startTime) * 2 + Math.floor(bookingStart.getMinutes() / 30))) {
                  const durationInSlots = (bookingEnd - bookingStart) / (30 * 60 * 1000); // Считаем длительность в слотах (30 минут = 1 слот)
                  const startSlot = (bookingStart.getHours() - startTime) * 2 + Math.floor(bookingStart.getMinutes() / 30); // Позиция в строках времени

                  return (
                    <div
                      key={booking.id}
                      className="booking-card"
                      style={{
                        height: `${durationInSlots * 60}px`,  // Высота бронирования пропорциональна его продолжительности
                        top: `${startSlot * 60}px`, // Позиция по времени
                      }}
                    >
                      {booking.deviceName}
                    </div>
                  );
                }

                return null;
              })}
            </div>
=======
  // Компонент для отладочного отображения списка бронирований
  const DebugBookingsList = () => {
    return (
      <div className="debug-bookings">
        <h3>Все бронирования ({bookings.length}):</h3>
        <ul>
          {bookings.map((booking, index) => {
            const deviceName = booking.deviceName || 'Устройство';
            
            return (
              <li key={index}>
                <strong>{deviceName}</strong>: 
                {booking.startTime ? ` с ${formatTime(booking.startTime)}` : ' время начала отсутствует'} 
                {booking.endTime ? ` до ${formatTime(booking.endTime)}` : ' время окончания отсутствует'}
                {booking.status ? ` (${booking.status})` : ''}
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  // Компонент карточки бронирования
  const BookingCard = ({ booking, bookingStart, bookingEnd }) => {
    // Вычисляем продолжительность в минутах
    const durationInMinutes = 
      ((bookingEnd.getHours() * 60 + bookingEnd.getMinutes()) - 
       (bookingStart.getHours() * 60 + bookingStart.getMinutes()));
    
    // Высота блока в пикселях (1 минута = 2 пикселя, минимум 60px)
    const heightInPixels = Math.max(durationInMinutes * 2, 60);
    
    const deviceName = booking.deviceName || 'Устройство';

    return (
      <div
        className="booking-card"
        style={{
          height: `${heightInPixels}px`,
          backgroundColor: getRandomColor(deviceName),
        }}
        title={`${deviceName}: ${formatTime(bookingStart)} - ${formatTime(bookingEnd)}`}
      >
        <div className="booking-card-content">
          <strong>{deviceName}</strong>
          <div>{formatTime(bookingStart)} - ${formatTime(bookingEnd)}</div>
          <div className="booking-status">{booking.status}</div>
        </div>
      </div>
    );
  };

  // Компонент отображения временной шкалы
  const TimelineView = () => {
    return (
      <>
        {filteredBookings.length === 0 && (
          <div className="no-bookings">
            <p>Нет бронирований на {formatDate(selectedDate)}</p>
          </div>
        )}
  
        <div className="timeline">
          <div className="timeline-header">
            <div className="timeline-time-slot"></div>
            <div className="timeline-date">
              <strong>{formatDate(selectedDate)}</strong>
            </div>
          </div>
  
          <div className="timeline-body">
            {timeSlots.map((slot, index) => {
              // Разбираем слот на часы и минуты
              const [slotHour, slotMinute] = slot.split(':').map(part => parseInt(part || '0', 10));
              
              return (
                <div key={slot} className="timeline-row">
                  <div className="timeline-time">{slot}</div>
                  <div className="timeline-cell">
                    {filteredBookings.map((booking, bookingIndex) => {
                      if (!booking.startTime || !booking.endTime) {
                        return null;
                      }
                      
                      try {
                        const bookingStart = new Date(booking.startTime);
                        const bookingEnd = new Date(booking.endTime);
                        
                        if (isNaN(bookingStart.getTime()) || isNaN(bookingEnd.getTime())) {
                          return null;
                        }
                        
                        const bookingStartHour = bookingStart.getHours();
                        const bookingStartMinute = bookingStart.getMinutes();
                        
                        const isFirstHalf = slotMinute === 0 && bookingStartMinute < 30;
                        const isSecondHalf = slotMinute === 30 && bookingStartMinute >= 30;
                        
                        // Проверяем совпадение временного слота с началом бронирования
                        if (slotHour === bookingStartHour && (isFirstHalf || isSecondHalf)) {
                          return (
                            <BookingCard 
                              key={`booking-${booking.id || bookingIndex}`} 
                              booking={booking} 
                              bookingStart={bookingStart} 
                              bookingEnd={bookingEnd} 
                            />
                          );
                        }
                      } catch (error) {
                        return null;
                      }
                      return null;
                    })}
                  </div>
                </div>
              );
            })}
>>>>>>> origin/main
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="timeline-container">
      <TimelineControls />
      <DebugBookingsList />
      
      {loading ? (
        <div className="loading">Загрузка...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <TimelineView />
      )}
    </div>
  );
};

export default Timeline;
