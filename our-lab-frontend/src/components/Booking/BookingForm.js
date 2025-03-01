import React, { useState } from 'react';
import { createBooking } from '/Users/eazyan/Documents/Our_Lab/our-lab-frontend/src/utils/api'; // Импортируем функцию для бронирования
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Импортируем стили для уведомлений

const BookingForm = ({ deviceId, deviceName, onBookingSuccess, status }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startTime || !endTime) {
      setError('Пожалуйста, укажите время бронирования.');
      return;
    }
  
    try {
      // Создаем бронирование с использованием deviceId и времени
      await createBooking(deviceId,deviceName, // Имя прибора
        startTime,
        endTime,
        status, // Статус по умолчанию
      );
  
      // Показ уведомления с помощью react-toastify
      toast.success(`Прибор забронирован с ${startTime} до ${endTime}`);
  
      // Обновляем состояние или вызываем функцию обратного вызова
      onBookingSuccess(startTime, endTime);
    } catch (error) {
      setError('Ошибка при бронировании. Пожалуйста, попробуйте позже.');
    }
  };

  return (
    <div>
      <h2>Бронирование прибора</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Время начала:</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Время окончания:</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <button type="submit">Забронировать</button>
      </form>
    </div>
  );
};

export default BookingForm;
