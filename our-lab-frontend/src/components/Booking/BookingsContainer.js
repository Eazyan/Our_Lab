import React from 'react';
import BookingList from './BookingList';
import BookingForm from './BookingForm';
import FilterControls from './FilterControls';
import BookingDetailsModal from './BookingDetailsModal';

const BookingsContainer = ({
  devices,
  selectedDevice,
  bookings,
  filter,
  showForm,
  selectedBooking,
  showModal,
  setFilter,
  setShowForm,
  setSelectedBooking,
  setShowModal,
  handleDeviceChange,
  handleBookingSuccess,
  handleCancelBooking,
  handleConfirmBooking,
  handleBookingClick
}) => {
  const [exportFunction, setExportFunction] = React.useState(null);

  const handleExportToExcel = () => {
    if (exportFunction) {
      exportFunction();
    }
  };

  return (
    <div className="bookings-container">
      <FilterControls
        filter={filter}
        onFilterChange={setFilter}
        onCreateBooking={() => setShowForm(!showForm)}
        onExportToExcel={handleExportToExcel}
      />
      
      {showForm && (
        <BookingForm
          devices={devices}
          selectedDevice={selectedDevice}
          onDeviceChange={handleDeviceChange}
          onSubmit={handleBookingSuccess}
        />
      )}
      
      <BookingList
        bookings={bookings}
        onConfirmBooking={handleConfirmBooking}
        onCancelBooking={handleCancelBooking}
        onBookingClick={handleBookingClick}
        onExportToExcel={setExportFunction}
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