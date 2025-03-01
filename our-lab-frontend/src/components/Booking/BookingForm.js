import React, { useState } from 'react';

const BookingForm = ({ deviceId, onBookingSuccess }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!startTime || !endTime) {
      alert("Пожалуйста, укажите время начала и окончания бронирования");
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      alert("Время окончания не может быть раньше времени начала");
      return;
    }

    onBookingSuccess(startTime, endTime); // Передаем данные обратно в родительский компонент
    setStartTime('');
    setEndTime('');
  };

  return (
    <div>
      <h3>Форма бронирования</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Время начала:</label>
          <input 
            type="datetime-local" 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)} 
          />
        </div>
        <div>
          <label>Время окончания:</label>
          <input 
            type="datetime-local" 
            value={endTime} 
            onChange={(e) => setEndTime(e.target.value)} 
          />
        </div>
        <button type="submit">Забронировать</button>
      </form>
    </div>
  );
};

export default BookingForm;
