import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './BookingForm.css';

const BookingForm = ({ deviceId, onBookingSuccess }) => {
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [startDate, setStartDate] = useState(getCurrentDate());
  const [startHour, setStartHour] = useState('8');
  const [startMinute, setStartMinute] = useState('30');
  
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [endHour, setEndHour] = useState('9');
  const [endMinute, setEndMinute] = useState('30');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hoursOptions = [];
  for (let i = 8; i <= 17; i++) {
    hoursOptions.push(
      <option key={i} value={i}>
        {i < 10 ? `0${i}` : i}:00
      </option>
    );
  }

  const minutesOptions = [];
  for (let i = 0; i < 60; i += 5) {
    minutesOptions.push(
      <option key={i} value={i}>
        {i < 10 ? `0${i}` : i}
      </option>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast.error("Пожалуйста, выберите дату начала и окончания бронирования");
      return;
    }

    console.log("Значения перед созданием объектов даты:", {
      startDate, startHour, startMinute,
      endDate, endHour, endMinute
    });

    try {
      const startDateStr = `${startDate}T${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}:00`;
      const endDateStr = `${endDate}T${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`;
      
      console.log("Строки дат для конструктора Date:", { startDateStr, endDateStr });
      
      const startDateObj = new Date(startDateStr);
      const endDateObj = new Date(endDateStr);
      
      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        console.error("Недействительные даты:", { startDateObj, endDateObj });
        toast.error("Ошибка при создании дат. Пожалуйста, проверьте введенные значения");
        return;
      }
      
      const timezoneOffset = new Date().getTimezoneOffset();
      console.log("Смещение часового пояса в минутах:", timezoneOffset);
      
      const correctedStartTime = new Date(startDateObj.getTime() - timezoneOffset * 60000).toISOString();
      const correctedEndTime = new Date(endDateObj.getTime() - timezoneOffset * 60000).toISOString();
      
      console.log("Скорректированное время для отправки:", {
        correctedStartTime,
        correctedEndTime
      });
      
      console.log("Созданные объекты дат:", { 
        startDateObj: startDateObj.toString(), 
        endDateObj: endDateObj.toString(),
        startTimeISO: startDateObj.toISOString(),
        endTimeISO: endDateObj.toISOString()
      });
  
      if (startDateObj >= endDateObj) {
        toast.error("Время окончания не может быть раньше времени начала");
        return;
      }
  
      setIsSubmitting(true);
      await onBookingSuccess(correctedStartTime, correctedEndTime);
      toast.success("Бронирование успешно создано!");
      
      setStartDate(getCurrentDate());
      setStartHour('8');
      setStartMinute('30');
      setEndDate(getCurrentDate());
      setEndHour('9');
      setEndMinute('30');
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
      <p style={{color: 'gray', fontSize: '0.9em'}}>Примечание: бронирование доступно только в рабочее время с 8:30 до 17:00</p>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h4>Время начала бронирования:</h4>
          <div className="time-inputs">
            <div className="form-group">
              <label>Дата:</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                required
                className="date-input"
              />
            </div>
            <div className="form-group">
              <label>Время:</label>
              <div className="time-selectors">
                <select 
                  value={startHour} 
                  onChange={(e) => setStartHour(e.target.value)}
                  className="time-select"
                >
                  {hoursOptions}
                </select>
                <span className="time-separator">:</span>
                <select 
                  value={startMinute} 
                  onChange={(e) => setStartMinute(e.target.value)}
                  className="time-select"
                >
                  {minutesOptions}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Время окончания бронирования:</h4>
          <div className="time-inputs">
            <div className="form-group">
              <label>Дата:</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                required
                className="date-input"
              />
            </div>
            <div className="form-group">
              <label>Время:</label>
              <div className="time-selectors">
                <select 
                  value={endHour} 
                  onChange={(e) => setEndHour(e.target.value)}
                  className="time-select"
                >
                  {hoursOptions}
                </select>
                <span className="time-separator">:</span>
                <select 
                  value={endMinute} 
                  onChange={(e) => setEndMinute(e.target.value)}
                  className="time-select"
                >
                  {minutesOptions}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="submit-button"
        >
          {isSubmitting ? "Отправка..." : "Забронировать"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
