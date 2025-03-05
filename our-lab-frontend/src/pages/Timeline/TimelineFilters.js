import React from 'react';

const TimelineFilters = ({ 
  devices, 
  selectedDevices, 
  setSelectedDevices,
  showCancelled,
  setShowCancelled,
  showOnlyConfirmed,
  setShowOnlyConfirmed
}) => {
  const handleDeviceChange = (deviceId) => {
    if (selectedDevices.includes(deviceId)) {
      setSelectedDevices(selectedDevices.filter(id => id !== deviceId));
    } else {
      setSelectedDevices([...selectedDevices, deviceId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedDevices.length === devices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(devices.map(device => device.id));
    }
  };

  return (
    <div style={{
      padding: '16px',
      backgroundColor: '#fff',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '16px'
    }}>
      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '8px',
          gap: '8px' 
        }}>
          <input
            type="checkbox"
            id="selectAll"
            checked={selectedDevices.length === devices.length}
            onChange={handleSelectAll}
          />
          <label htmlFor="selectAll" style={{ cursor: 'pointer' }}>
            Выбрать все приборы
          </label>
        </div>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '8px' 
        }}>
          {devices.map(device => (
            <label
              key={device.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                borderRadius: '4px',
                backgroundColor: selectedDevices.includes(device.id) ? '#e3f2fd' : '#f5f5f5',
                cursor: 'pointer'
              }}
            >
              <input
                type="checkbox"
                checked={selectedDevices.includes(device.id)}
                onChange={() => handleDeviceChange(device.id)}
              />
              {device.name}
            </label>
          ))}
        </div>
      </div>
      <div style={{ 
        display: 'flex', 
        gap: '16px',
        borderTop: '1px solid #eee',
        paddingTop: '16px'
      }}>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={!showCancelled}
            onChange={(e) => setShowCancelled(!e.target.checked)}
          />
          Скрыть отменённые
        </label>
        <label style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          cursor: 'pointer'
        }}>
          <input
            type="checkbox"
            checked={showOnlyConfirmed}
            onChange={(e) => setShowOnlyConfirmed(e.target.checked)}
          />
          Только подтверждённые
        </label>
      </div>
    </div>
  );
};

export default TimelineFilters; 