import React from 'react';
import BookingCard from './BookingCard';

const TimelineView = ({ timeSlots, selectedDate, filteredBookings }) => {
  return (
    <div className="timeline">
      <div className="timeline-header">
        <div className="timeline-time-slot">Время</div>
        <div className="timeline-date">
          {selectedDate.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>
      
      <div className="timeline-body">
        {timeSlots.map((slot) => (
          <div key={slot} className="timeline-row">
            <div className="timeline-time">{slot}</div>
            <div className="timeline-cell">
              {filteredBookings.map((booking) => {
                const bookingStart = new Date(booking.startTime);
                const bookingEnd = new Date(booking.endTime);
                
                // Check if booking should appear in this time slot
                const slotHour = parseInt(slot.split(':')[0]);
                const slotMinute = parseInt(slot.split(':')[1] || 0);
                
                const bookingStartHour = bookingStart.getHours();
                const bookingStartMinute = bookingStart.getMinutes();
                
                // Show booking card at its start position
                if (slotHour === bookingStartHour && 
                    (slotMinute === 0 && bookingStartMinute < 30 || 
                     slotMinute === 30 && bookingStartMinute >= 30)) {
                  return (
                    <BookingCard 
                      key={booking.id}
                      booking={booking}
                      bookingStart={bookingStart}
                      bookingEnd={bookingEnd}
                    />
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

export default TimelineView; 