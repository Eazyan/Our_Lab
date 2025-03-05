import React from 'react';
import BookingCard from './BookingCard';
import { formatTime } from './timeUtils';

const TimelineView = ({ selectedDate, filteredBookings, timeSlots }) => {
  return (
    <div className="timeline">
      <div className="timeline-header">
        <div className="timeline-time-slot">Время</div>
        <div className="timeline-date">
          {selectedDate.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>
      <div className="timeline-body" style={{ position: 'relative', height: '700px', backgroundColor: '#f5f5f5', paddingTop: '10px' }}>
        {/* Временная сетка */}
        {timeSlots.map((slot, index) => {
          const position = (index / (timeSlots.length - 1)) * 100;
          return (
            <div key={slot}>
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `calc(${position}% + 10px)`,
                borderTop: '1px solid #e0e0e0',
                zIndex: 0
              }} />
              <div style={{
                position: 'absolute',
                left: '5px',
                top: `calc(${position}% + 10px)`,
                transform: 'translateY(-50%)',
                fontSize: '12px',
                color: '#666',
                zIndex: 1
              }}>
                {slot}
              </div>
            </div>
          );
        })}
        
        {/* Бронирования */}
        {filteredBookings && filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => {
            const startTime = booking.start_time || booking.startTime;
            const endTime = booking.end_time || booking.endTime;
            
            if (!startTime || !endTime) return null;

            const bookingStart = new Date(startTime);
            const bookingEnd = new Date(endTime);

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