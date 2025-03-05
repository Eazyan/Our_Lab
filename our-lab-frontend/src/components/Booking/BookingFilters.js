import React from 'react';
import './BookingFilters.css';

const BookingFilters = ({
  showOnlyMine,
  setShowOnlyMine,
  showOnlyToday,
  setShowOnlyToday,
  filterStatus,
  setFilterStatus,
  devices,
  selectedDevices,
  handleDeviceChange,
  handleSelectAllDevices,
  canManageBookings,
  handleExportToExcel
}) => {
  const allDevicesSelected = selectedDevices.length === devices.length;

  return (
    <div className="booking-history-filters">
      <div className="history-filter-group">
        <label className="history-filter-checkbox">
          <input
            type="checkbox"
            checked={showOnlyMine}
            onChange={(e) => setShowOnlyMine(e.target.checked)}
          />
          <span>Мои бронирования</span>
        </label>
        <label className="history-filter-checkbox">
          <input
            type="checkbox"
            checked={showOnlyToday}
            onChange={(e) => setShowOnlyToday(e.target.checked)}
          />
          <span>Сегодня</span>
        </label>
      </div>
      
      <div className="history-devices-filter">
        <div className="devices-filter-header">
          <label className="history-filter-checkbox">
            <input
              type="checkbox"
              checked={allDevicesSelected}
              onChange={handleSelectAllDevices}
            />
            <span>Выбрать все приборы</span>
          </label>
        </div>
        <div className="devices-filter-list">
          {devices.map(device => (
            <label
              key={device.id}
              className="device-filter-checkbox"
            >
              <input
                type="checkbox"
                checked={selectedDevices.includes(device.id)}
                onChange={() => handleDeviceChange(device.id)}
              />
              <span>{device.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="history-filter-buttons">
        <button
          className={`history-filter-button ${filterStatus === 'all' ? 'active' : ''}`}
          onClick={() => setFilterStatus('all')}
        >
          Все
        </button>
        <button
          className={`history-filter-button ${filterStatus === 'pending' ? 'active' : ''}`}
          onClick={() => setFilterStatus('pending')}
        >
          Ожидающие
        </button>
        <button
          className={`history-filter-button ${filterStatus === 'confirmed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('confirmed')}
        >
          Подтверждённые
        </button>
        <button
          className={`history-filter-button ${filterStatus === 'cancelled' ? 'active' : ''}`}
          onClick={() => setFilterStatus('cancelled')}
        >
          Отменённые
        </button>
      </div>
      {canManageBookings && (
        <button 
          onClick={handleExportToExcel}
          className="history-export-button"
        >
          Выгрузить в Excel
        </button>
      )}
    </div>
  );
};

export default BookingFilters; 