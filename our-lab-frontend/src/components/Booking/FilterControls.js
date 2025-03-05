import React from 'react';

const FilterControls = ({ filter, onFilterChange, onCreateBooking, onExportToExcel }) => {
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
      <div className="action-buttons">
        <button 
          className="export-button"
          onClick={onExportToExcel}
        >
          Выгрузить в Excel
        </button>
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