import React from 'react';

const TimelineControls = ({ 
  selectedDate, 
  goToPreviousDay, 
  goToNextDay, 
  handleDateChange 
}) => {
  return (
    <div className="timeline-controls">
      <button className="control-button" onClick={goToPreviousDay}>
        Предыдущий день
      </button>
      
      <div className="date-selector">
        <input
          type="date"
          className="date-input"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={handleDateChange}
        />
        <h3>{selectedDate.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
      </div>
      
      <button className="control-button" onClick={goToNextDay}>
        Следующий день
      </button>
    </div>
  );
};

export default TimelineControls; 