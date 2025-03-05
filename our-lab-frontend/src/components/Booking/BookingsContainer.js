import React from 'react';
import BookingHistory from './BookingHistory';
import BookingForm from './BookingForm';
import FilterControls from './FilterControls';
import BookingDetailsModal from './BookingDetailsModal';

const BookingsContainer = ({
  devices,
  selectedDevice,
  bookings,
  showForm,
  selectedBooking,
  showModal,
  setShowForm,
  setSelectedBooking,
  setShowModal,
  handleDeviceChange,
  handleBookingSuccess,
  handleCancelBooking,
  handleConfirmBooking,
  handleBookingClick
}) => {
  return (
    <div className="bookings-container">
      <FilterControls
        onCreateBooking={() => setShowForm(!showForm)}
      />
      
      {showForm && (
        <BookingForm
          devices={devices}
          selectedDevice={selectedDevice}
          onDeviceChange={handleDeviceChange}
          onSubmit={handleBookingSuccess}
        />
      )}
      
      <BookingHistory
        bookings={bookings}
        devices={devices}
        onCancel={handleCancelBooking}
        onConfirm={handleConfirmBooking}
        onDelete={handleBookingClick}
      />

      {showModal && selectedBooking && (
        <BookingDetailsModal
          booking={selectedBooking}
          onClose={() => {
            setShowModal(false);
            setSelectedBooking(null);
          }}
          onConfirm={handleConfirmBooking}
          onCancel={handleCancelBooking}
        />
      )}
    </div>
  );
};

export default BookingsContainer; 