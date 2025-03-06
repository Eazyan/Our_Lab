import React from 'react';
import './styles/filters.css';
import './styles/devices.css';
import './styles/buttons.css';

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
  return (
    <div className="filters-container">
      <div className="filter-section">
        <div className="filter-group">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showOnlyMine}
              onChange={(e) => setShowOnlyMine(e.target.checked)}
            />
            <span>Мои бронирования</span>
          </label>
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={showOnlyToday}
              onChange={(e) => setShowOnlyToday(e.target.checked)}
            />
            <span>Сегодня</span>
          </label>
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-select"
          >
            <option value="all">Все статусы</option>
            <option value="pending">Ожидающие</option>
            <option value="confirmed">Подтверждённые</option>
            <option value="cancelled">Отменённые</option>
            <option value="completed">Завершённые</option>
          </select>
        </div>
      </div>

      <div className="filter-section devices-section">
        <div className="filter-header">
          <label className="filter-checkbox">
            <input
              type="checkbox"
              checked={selectedDevices.length === devices.length}
              onChange={handleSelectAllDevices}
            />
            <span>Все устройства</span>
          </label>
        </div>
        <div className="device-filters">
          {devices.map((device) => (
            <label key={device.id} className="device-checkbox">
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

      {canManageBookings && (
        <div className="filter-section">
          <button onClick={handleExportToExcel} className="export-button">
            Выгрузить в Excel
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingFilters; 