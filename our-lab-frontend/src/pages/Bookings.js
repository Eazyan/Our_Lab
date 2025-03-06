import React, { useState, useEffect } from 'react';
import useBookings from '../hooks/useBookings';
import PageHeader from '../components/Booking/PageHeader';
import BookingsContainer from '../components/Booking/BookingsContainer';
import LoadingState from '../components/Booking/LoadingState';
import '../styles/components/BookingList.css';
import '../styles/components/BookingForm.css';
import '../styles/components/FilterControls.css';
import '../styles/components/BookingRow.css';
import '../styles/components/PageHeader.css';
import '../components/Booking/styles/layout.css';
import '../components/Booking/styles/booking-item.css';
import '../components/Booking/styles/modal.css';
import '../components/Booking/styles/actions.css';

const Bookings = () => {
  const {
    devices,
    selectedDevice,
    bookings,
    filter,
    loading,
    showForm,
    selectedBooking,
    showModal,
    setFilter,
    setShowForm,
    setSelectedBooking,
    setShowModal,
    handleDeviceChange,
    handleBookingSuccess,
    cancelBooking,
    confirmBooking,
    deleteBooking,
    handleBookingClick
  } = useBookings();

  if (loading) {
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
        handleCancelBooking={cancelBooking}
        handleConfirmBooking={confirmBooking}
        handleBookingClick={deleteBooking}
      />
    </div>
  );
};

export default Bookings;
