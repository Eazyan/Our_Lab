import React, { useMemo } from 'react';
import BookingCard from './BookingCard';

const TimelineView = ({ timeSlots, selectedDate, filteredBookings }) => {
  const bookingsBySlot = useMemo(() => {
    const slotMap = {};
    
    timeSlots.forEach(slot => {
      slotMap[slot] = [];
    });
    
    filteredBookings.forEach(booking => {
      const bookingStart = new Date(booking.startTime);
      const bookingStartHour = bookingStart.getHours();
      const bookingStartMinute = bookingStart.getMinutes();
      
      let slotKey;
      if (bookingStartMinute < 30) {
        slotKey = `${bookingStartHour}:00`;
      } else {
        slotKey = `${bookingStartHour}:30`;
      }
      
      if (slotMap[slotKey]) {
        slotMap[slotKey].push(booking);
      }
    });
    
    return slotMap;
  }, [timeSlots, filteredBookings]);
  
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
              {bookingsBySlot[slot].map((booking) => {
                const bookingStart = new Date(booking.startTime);
                const bookingEnd = new Date(booking.endTime);
                
                return (
                  <BookingCard 
                    key={booking.id}
                    booking={booking}
                    bookingStart={bookingStart}
                    bookingEnd={bookingEnd}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(TimelineView); 