import React from 'react';

const FilterControls = ({ filter, onFilterChange, onCreateBooking }) => {
  return (
    <div className="bookings-actions">
      <div className="filter-controls">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => onFilterChange('all')}
        >
          Все
        </button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => onFilterChange('pending')}
        >
          Ожидающие
        </button>
        <button 
          className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
          onClick={() => onFilterChange('cancelled')}
        >
          Отменённые
        </button>
      </div>
      <button 
        className="create-booking-btn"
        onClick={onCreateBooking}
      >
        Создать бронирование
      </button>
    </div>
  );
};

export default FilterControls; 