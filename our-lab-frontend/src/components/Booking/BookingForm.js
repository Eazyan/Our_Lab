import React, { useState } from 'react';
import { toast } from 'react-toastify';

const BookingForm = ({ deviceId, onBookingSuccess }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Форма отправлена с данными:", { deviceId, startTime, endTime });

    if (!startTime || !endTime) {
      toast.error("Пожалуйста, укажите время начала и окончания бронирования");
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      toast.error("Время окончания не может быть раньше времени начала");
      return;
    }

    try {
      setIsSubmitting(true);
      await onBookingSuccess(startTime, endTime);
      toast.success("Бронирование успешно создано!");
      setStartTime('');
      setEndTime('');
    } catch (error) {
      console.error('Ошибка при создании бронирования:', error);
      toast.error("Не удалось создать бронирование: " + (error.message || "Неизвестная ошибка"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="booking-form">
      <h3>Форма бронирования</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Время начала:</label>
          <input 
            type="datetime-local" 
            value={startTime} 
            onChange={(e) => setStartTime(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label>Время окончания:</label>
          <input 
            type="datetime-local" 
            value={endTime} 
            onChange={(e) => setEndTime(e.target.value)} 
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Отправка..." : "Забронировать"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
