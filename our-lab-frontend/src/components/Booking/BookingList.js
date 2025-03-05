import React from 'react';
import { toast } from 'react-toastify';
import BookingRow from './BookingRow';

const BookingList = ({ 
  bookings, 
  onConfirmBooking, 
  onCancelBooking, 
  onBookingClick 
}) => {
  if (!bookings || bookings.length === 0) {
    return (
      <div className="bookings-empty">
        <p>Нет бронирований</p>
      </div>
    );
  }

  return (
    <div className="bookings-table">
      <div className="bookings-header">
        <div className="booking-cell device-cell">Прибор</div>
        <div className="booking-cell date-cell">Дата</div>
        <div className="booking-cell time-cell">Начало</div>
        <div className="booking-cell time-cell">Окончание</div>
        <div className="booking-cell status-cell">Статус</div>
        <div className="booking-cell actions-cell">Действия</div>
      </div>
      
      {bookings.map(booking => (
        <BookingRow
          key={booking.id}
          booking={booking}
          onConfirmBooking={onConfirmBooking}
          onCancelBooking={onCancelBooking}
          onBookingClick={onBookingClick}
        />
      ))}
    </div>
  );
};

export default BookingList; 