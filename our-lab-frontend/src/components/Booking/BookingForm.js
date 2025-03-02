import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './BookingForm.css'; // Добавим для стилизации новых полей

const BookingForm = ({ deviceId, onBookingSuccess }) => {
  // Функция для получения текущей даты в формате YYYY-MM-DD
  const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Вместо простых строк для datetime-local, используем отдельные state для даты, часов и минут
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [startHour, setStartHour] = useState('8');
  const [startMinute, setStartMinute] = useState('30');  // начинаем с 8:30
  
  const [endDate, setEndDate] = useState(getCurrentDate());
  const [endHour, setEndHour] = useState('9');
  const [endMinute, setEndMinute] = useState('30');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Генерируем опции для выбора часов (8:30 - 17:00)
  const hoursOptions = [];
  for (let i = 8; i <= 17; i++) {
    hoursOptions.push(
      <option key={i} value={i}>
        {i < 10 ? `0${i}` : i}:00
      </option>
    );
  }

  // Генерируем опции для выбора минут (с шагом 5 минут)
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

    // Выводим значения для отладки
    console.log("Значения перед созданием объектов даты:", {
      startDate, startHour, startMinute,
      endDate, endHour, endMinute
    });

    try {
      // Создаем строки в формате ISO для конструктора Date
      const startDateStr = `${startDate}T${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}:00`;
      const endDateStr = `${endDate}T${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`;
      
      console.log("Строки дат для конструктора Date:", { startDateStr, endDateStr });
      
      // Создаем объекты Date
      const startDateObj = new Date(startDateStr);
      const endDateObj = new Date(endDateStr);
      
      // Проверяем валидность созданных объектов
      if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
        console.error("Недействительные даты:", { startDateObj, endDateObj });
        toast.error("Ошибка при создании дат. Пожалуйста, проверьте введенные значения");
        return;
      }
      
      // Получаем смещение часового пояса в минутах
      const timezoneOffset = new Date().getTimezoneOffset();
      console.log("Смещение часового пояса в минутах:", timezoneOffset);
      
      // Корректируем время с учетом часового пояса для отправки на сервер
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
      // Передаем скорректированные строки ISO в обработчик
      await onBookingSuccess(correctedStartTime, correctedEndTime);
      toast.success("Бронирование успешно создано!");
      
      // Сбрасываем форму
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
