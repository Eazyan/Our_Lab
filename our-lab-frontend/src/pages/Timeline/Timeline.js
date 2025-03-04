import React, { useState, useEffect } from 'react';
import '../Timeline.css';
import { getBookings } from '../../utils/api.js';
import TimelineControls from './TimelineControls';
import TimelineView from './TimelineView';
import { isSameDay } from './utils';
import DebugBookings from './DebugBookings';

const Timeline = () => {
  const startTime = 8;  
  const endTime = 17;   
  const timeSlots = [];

  for (let i = startTime; i <= endTime; i++) {
    timeSlots.push(`${i}:00`, `${i}:30`);
  }

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setSelectedDate(newDate);
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchBookings = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        const response = await getBookings();
        console.log('Получены данные о бронированиях:', response);
        
        if (isMounted) {
          // Проверяем структуру ответа и извлекаем данные
          const bookingsData = response?.data || response || [];
          console.log('Обработанные данные о бронированиях:', bookingsData);
          setBookings(bookingsData);
          setError(null);
        }
      } catch (err) {
        console.error('Ошибка при загрузке бронирований:', err);
        if (isMounted) {
          setError('Не удалось загрузить данные о бронированиях');
          setBookings([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBookings();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredBookings = bookings.filter(booking => {
    console.log('Проверка бронирования для фильтрации:', booking);
    if (!booking || !booking.startTime) {
      console.log('Бронирование пропущено - нет startTime');
      return false;
    }
    
    const bookingDate = new Date(booking.startTime);
    const selected = new Date(selectedDate);
    
    console.log('Сравнение дат:', {
      bookingDate: bookingDate.toISOString(),
      selectedDate: selected.toISOString(),
      sameDate: bookingDate.getDate() === selected.getDate(),
      sameMonth: bookingDate.getMonth() === selected.getMonth(),
      sameYear: bookingDate.getFullYear() === selected.getFullYear()
    });
    
    return bookingDate.getDate() === selected.getDate() &&
           bookingDate.getMonth() === selected.getMonth() &&
           bookingDate.getFullYear() === selected.getFullYear();
  });

  if (loading) {
    return <div className="loading">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

  return (
    <div className="timeline-container">
      <h2>Расписание бронирований</h2>
      
      <TimelineControls 
        selectedDate={selectedDate}
        goToPreviousDay={goToPreviousDay}
        goToNextDay={goToNextDay}
        handleDateChange={handleDateChange}
      />
      
      {filteredBookings.length === 0 ? (
        <div className="no-bookings">
          Нет бронирований на выбранную дату.
        </div>
      ) : (
        <TimelineView 
          timeSlots={timeSlots}
          selectedDate={selectedDate}
          filteredBookings={filteredBookings}
        />
      )}
      
      <DebugBookings bookings={bookings} error={error} />
    </div>
  );
};

export default Timeline; 