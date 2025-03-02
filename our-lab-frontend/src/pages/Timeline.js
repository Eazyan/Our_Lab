import React, { useState, useEffect } from 'react';
import './Timeline.css';
import { getBookings } from '../utils/api.js'; // Для получения бронирований

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
      </div>

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
