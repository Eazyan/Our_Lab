import React from 'react';
import useBookings from '../hooks/useBookings';
import PageHeader from '../components/Booking/PageHeader';
import BookingsContainer from '../components/Booking/BookingsContainer';
import LoadingState from '../components/Booking/LoadingState';
import '../styles/components/BookingList.css';
import '../styles/components/BookingForm.css';
import '../styles/components/FilterControls.css';
import '../styles/components/BookingRow.css';
import '../styles/components/PageHeader.css';

const Bookings = () => {
  const {
    devices,
    selectedDevice,
    bookings,
    filter,
    isLoading,
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
  } = useBookings();

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="bookings-page">
      <PageHeader />
      <BookingsContainer
        devices={devices}
        selectedDevice={selectedDevice}
        bookings={bookings}
        filter={filter}
        showForm={showForm}
        selectedBooking={selectedBooking}
        showModal={showModal}
        setFilter={setFilter}
        setShowForm={setShowForm}
        setSelectedBooking={setSelectedBooking}
        setShowModal={setShowModal}
        handleDeviceChange={handleDeviceChange}
        handleBookingSuccess={handleBookingSuccess}
        handleCancelBooking={handleCancelBooking}
        handleConfirmBooking={handleConfirmBooking}
        handleBookingClick={handleBookingClick}
      />
    </div>
  );
};

export default Bookings;
