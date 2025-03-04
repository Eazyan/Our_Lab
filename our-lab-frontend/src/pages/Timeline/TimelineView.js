import React from 'react';
import BookingCard from './BookingCard';

const TimelineView = ({ selectedDate, filteredBookings, timeSlots }) => {
  console.log('TimelineView: начало рендеринга');
  console.log('Отфильтрованные бронирования:', filteredBookings);
  console.log('Выбранная дата:', selectedDate);
  console.log('Временные слоты:', timeSlots);
  
  return (
    <div className="timeline">
      <div className="timeline-header">
        <div className="timeline-time-slot">Время</div>
        <div className="timeline-date">
          {selectedDate.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>
      <div className="timeline-body" style={{ position: 'relative', height: '700px', backgroundColor: '#f5f5f5' }}>
        {/* Временная сетка */}
        {timeSlots.map((slot, index) => (
          <div key={slot}>
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: `${(index / timeSlots.length) * 100}%`,
              borderTop: '1px solid #e0e0e0',
              zIndex: 1
            }} />
            <div style={{
              position: 'absolute',
              left: '5px',
              top: `${(index / timeSlots.length) * 100}%`,
              transform: 'translateY(-50%)',
              fontSize: '12px',
              color: '#666',
              zIndex: 2
            }}>
              {slot}
            </div>
          </div>
        ))}
        
        {/* Бронирования */}
        {filteredBookings && filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => {
            console.log('Рендеринг бронирования:', booking);
            if (!booking.startTime || !booking.endTime) {
              console.log('Пропуск бронирования - отсутствует startTime или endTime');
              return null;
            }
            const bookingStart = new Date(booking.startTime);
            const bookingEnd = new Date(booking.endTime);
            console.log('Время бронирования:', {
              start: bookingStart.toISOString(),
              end: bookingEnd.toISOString()
            });
            return (
              <BookingCard 
                key={booking.id}
                booking={booking}
                bookingStart={bookingStart}
                bookingEnd={bookingEnd}
              />
            );
          })
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            Нет бронирований для отображения
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineView; 