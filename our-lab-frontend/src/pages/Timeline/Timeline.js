import React, { useState, useEffect } from 'react';
import { bookingService, deviceService } from '../../services/api';
import './Timeline.css';
import TimelineControls from './TimelineControls';
import TimelineView from './TimelineView';
import TimelineFilters from './TimelineFilters';
import { getTimeFromDate } from './timeUtils';

const Timeline = ({ bookings: initialBookings, devices: initialDevices }) => {
  const startTime = 8;  
  const endTime = 17;   
  const timeSlots = [];

  for (let i = startTime; i <= endTime; i++) {
    timeSlots.push(`${i}:00`, `${i}:30`);
  }

  const [bookings, setBookings] = useState(initialBookings || []);
  const [devices, setDevices] = useState(initialDevices || []);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [error, setError] = useState(null);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [showCancelled, setShowCancelled] = useState(true);
  const [showOnlyConfirmed, setShowOnlyConfirmed] = useState(false);

  const convertToVladivostokTime = (dateString) => {
    const date = new Date(dateString);
    date.setUTCHours(date.getUTCHours() - 10);
    return date;
  };

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

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getBookings();
      setBookings(data);
    } catch (err) {
      setError('Ошибка загрузки бронирований');
      console.error('Ошибка:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDevices = async () => {
    try {
      const data = await deviceService.getDevices();
      setDevices(data);
      setSelectedDevices(data.map(device => device.id));
    } catch (err) {
      setError('Ошибка загрузки устройств');
      console.error('Ошибка:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchDevices();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (!booking) return false;

    const startTime = booking.start_time || booking.startTime;
    if (!startTime) return false;
    
    const bookingDate = convertToVladivostokTime(startTime);
    const selected = new Date(selectedDate);
    
    selected.setHours(0, 0, 0, 0);
    const compareDate = new Date(bookingDate);
    compareDate.setHours(0, 0, 0, 0);
    
    const deviceId = booking.deviceId || booking.device_id;
    const status = booking.status || 'pending';

    // Фильтр по выбранным устройствам
    if (!selectedDevices.includes(deviceId)) {
      return false;
    }

    // Фильтр по статусу "отменено"
    if (!showCancelled && status === 'cancelled') {
      return false;
    }

    // Фильтр "только подтвержденные"
    if (showOnlyConfirmed && status !== 'confirmed') {
      return false;
    }

    return compareDate.getTime() === selected.getTime();
  });

  const processedBookings = filteredBookings.map(booking => ({
    ...booking,
    start_time: convertToVladivostokTime(booking.start_time || booking.startTime).toISOString(),
    end_time: convertToVladivostokTime(booking.end_time || booking.endTime).toISOString()
  }));

  if (loading) {
    return <div className="loading">Загрузка данных...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

  return (
    <div className="timeline-container">
      <h2>Временная шкала бронирований</h2>
      
      <TimelineControls 
        selectedDate={selectedDate}
        goToPreviousDay={goToPreviousDay}
        goToNextDay={goToNextDay}
        handleDateChange={handleDateChange}
      />
      
      <TimelineFilters
        devices={devices}
        selectedDevices={selectedDevices}
        setSelectedDevices={setSelectedDevices}
        showCancelled={showCancelled}
        setShowCancelled={setShowCancelled}
        showOnlyConfirmed={showOnlyConfirmed}
        setShowOnlyConfirmed={setShowOnlyConfirmed}
      />
      
      {processedBookings.length === 0 ? (
        <div className="no-bookings">
          Нет бронирований на выбранную дату.
        </div>
      ) : (
        <TimelineView 
          timeSlots={timeSlots}
          selectedDate={selectedDate}
          filteredBookings={processedBookings}
          devices={devices}
        />
      )}
    </div>
  );
};

export default Timeline; 