import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './BookingForm.css';

const BookingForm = ({ 
  devices, 
  selectedDevice, 
  onDeviceChange, 
  onSubmit 
}) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setStartTime('');
    setEndTime('');
  };

  const handleStartTimeChange = (e) => {
    const value = e.target.value;
    setStartTime(value);
  };

  const handleEndTimeChange = (e) => {
    const value = e.target.value;
    if (!startTime || value > startTime) {
      setEndTime(value);
    } else {
      toast.error('Время окончания должно быть позже времени начала');
    }
  };

  const handleSubmit = () => {
    if (!selectedDate || !startTime || !endTime) {
      toast.error('Укажите дату и время');
      return;
    }

    // Создаем даты в UTC
    const startDateTime = new Date(`${selectedDate}T${startTime}Z`);
    const endDateTime = new Date(`${selectedDate}T${endTime}Z`);

    onSubmit(startDateTime.toISOString(), endDateTime.toISOString());
  };

  return (
    <div className="booking-form">
      <h3>Новое бронирование</h3>
      <div className="form-group">
        <label>Выберите прибор:</label>
        <select 
          value={selectedDevice} 
          onChange={onDeviceChange}
        >
          <option value="">-- Выберите прибор --</option>
          {devices.map(device => (
            <option key={device.id} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Выберите дату:</label>
        <input 
          type="date" 
          value={selectedDate}
          onChange={handleDateChange}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
      
      <div className="form-group">
        <label>Время начала:</label>
        <input 
          type="time" 
          value={startTime}
          onChange={handleStartTimeChange}
          disabled={!selectedDate}
          min="08:30"
          max="17:00"
        />
      </div>
      
      <div className="form-group">
        <label>Время окончания:</label>
        <input 
          type="time" 
          value={endTime}
          onChange={handleEndTimeChange}
          disabled={!selectedDate || !startTime}
          min="08:30"
          max="17:00"
        />
      </div>
      
      <button onClick={handleSubmit}>
        Забронировать
      </button>
    </div>
  );
};

export default BookingForm;
