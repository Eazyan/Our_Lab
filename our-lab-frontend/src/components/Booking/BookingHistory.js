import React from 'react';

const BookingHistory = ({ bookings, devices }) => {
  return (
    <div>
      <h3>История бронирований</h3>
      {bookings.length === 0 ? (
        <p>Нет бронирований</p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => {
            const device = devices.find((device) => device.id === booking.deviceId);
            return (
              <div key={booking.id} className="booking-item">
                <div className="booking-device">
                  {device ? device.name : 'Неизвестный прибор'}
                </div>
                <div className="booking-time">
                  {new Date(booking.startTime).toLocaleString()} - {new Date(booking.endTime).toLocaleString()}
                </div>
                <div className="booking-status">
                  Статус: <strong>{booking.status}</strong>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
