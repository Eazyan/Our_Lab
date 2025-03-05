import React from 'react';
import { toast } from 'react-toastify';
import './BookingForm.css';

const BookingForm = ({ 
  devices, 
  selectedDevice, 
  onDeviceChange, 
  onSubmit 
}) => {
  return (
    <div className="booking-form">
      <h3>Новое бронирование</h3>
      <div className="form-group">
        <label>Выберите прибор:</label>
        <select 
          value={selectedDevice} 
          onChange={onDeviceChange}
        >
          <option value="">-- Выберите прибор --</option>
          {devices.map(device => (
            <option key={device.id} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label>Дата и время начала:</label>
        <input 
          type="datetime-local" 
          id="start-time"
        />
      </div>
      
      <div className="form-group">
        <label>Дата и время окончания:</label>
        <input 
          type="datetime-local" 
          id="end-time"
        />
      </div>
      
      <button
        onClick={() => {
          const startTime = document.getElementById('start-time').value;
          const endTime = document.getElementById('end-time').value;
          
          if (!startTime || !endTime) {
            toast.error('Укажите время начала и окончания');
            return;
          }
          
          onSubmit(startTime, endTime);
        }}
      >
        Забронировать
      </button>
    </div>
  );
};

export default BookingForm;
