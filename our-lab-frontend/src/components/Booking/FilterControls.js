import React from 'react';

const FilterControls = ({ onCreateBooking }) => {
  return (
    <div className="bookings-actions">
      <div className="action-buttons">
        <button 
          className="create-booking-btn"
          onClick={onCreateBooking}
        >
          Создать бронирование
        </button>
      </div>
    </div>
  );
};

export default FilterControls; 