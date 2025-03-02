import React, { useState, useEffect } from 'react';
import '../Timeline.css'; // Keep using the existing CSS
import { getBookings } from '../../utils/api.js';
import TimelineControls from './TimelineControls';
import TimelineView from './TimelineView';
import { isSameDay } from './utils';

const Timeline = () => {
  const startTime = 8;  // Начало времени (8:00)
  const endTime = 17;   // Конец времени (17:00)
  const timeSlots = [];

  // Генерация временных слотов с шагом 30 минут
  for (let i = startTime; i <= endTime; i++) {
    timeSlots.push(`${i}:00`, `${i}:30`);
  }

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);

  // Navigate to the next day
  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setSelectedDate(nextDay);
  };

  // Navigate to the previous day
  const goToPreviousDay = () => {
    const prevDay = new Date(selectedDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setSelectedDate(prevDay);
  };

  // Handle date input change
  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setSelectedDate(newDate);
  };

  // Fetch bookings data from API - with debounce
  useEffect(() => {
    let isMounted = true;
    
    const fetchBookings = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        // Add a small timeout to prevent too frequent API calls
        const data = await getBookings();
        if (isMounted) {
          setBookings(data || []);
          setError(null);
        }
      } catch (err) {
        console.error('Ошибка при загрузке бронирований:', err);
        if (isMounted) {
          setError('Не удалось загрузить данные о бронированиях');
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

  // Filter bookings for the selected date
  const filteredBookings = bookings.filter(booking => 
    isSameDay(booking.startTime, selectedDate)
  );

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
    </div>
  );
};

export default Timeline; 