import React from 'react';
import './Timeline.css';

const Timeline = ({ bookings }) => {
  const startTime = 8;  // Начало времени (8:00)
  const endTime = 23;   // Конец времени (23:00)
  const timeSlots = [];

  // Генерация временных слотов с шагом 30 минут
  for (let i = startTime; i <= endTime; i++) {
    timeSlots.push(`${i}:00`, `${i}:30`);
  }

  // Получаем уникальные даты для таймлайна
  const dates = bookings.reduce((acc, booking) => {
    const date = new Date(booking.startTime).toLocaleDateString();
    if (!acc.includes(date)) acc.push(date);
    return acc;
  }, []);

  return (
    <div className="timeline">
      <div className="timeline-header">
        <div className="timeline-time-slot"></div>
        {dates.map((date) => (
          <div key={date} className="timeline-date">
            <strong>{date}</strong>
          </div>
        ))}
      </div>

      <div className="timeline-body">
        {timeSlots.map((slot) => (
          <div key={slot} className="timeline-row">
            <div className="timeline-time">{slot}</div>
            {dates.map((date) => {
              // Фильтруем бронирования по дате
              const relevantBookings = bookings.filter((booking) => {
                const bookingDate = new Date(booking.startTime).toLocaleDateString();
                return bookingDate === date;
              });

              return (
                <div key={date} className="timeline-cell">
                  {relevantBookings.map((booking) => {
                    const start = new Date(booking.startTime);
                    const end = new Date(booking.endTime);

                    // Расчет времени в слотах (0.5 часов = 1 слот)
                    const startSlot = (start.getHours() - startTime) * 2 + Math.floor(start.getMinutes() / 30); // Позиция карточки по времени
                    const durationInSlots = (end - start) / (30 * 60 * 1000); // Количество слотов (каждый слот - 30 минут)

                    // Позиция по вертикали, сколько слотов прошло с начала дня
                    const topPosition = (startSlot / (2 * (endTime - startTime))) * 100;

                    return (
                      <div
                        key={booking.id}
                        className="booking-card"
                        style={{
                          height: `${durationInSlots * 100}%`,  // Высота зависит от длительности бронирования
                          top: `${topPosition}%`,               // Позиция сверху в зависимости от времени начала
                        }}
                      >
                        {booking.deviceName}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
