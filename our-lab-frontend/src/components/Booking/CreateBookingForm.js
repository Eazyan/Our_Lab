import React, { useState } from 'react';
import axios from 'axios';
import { apiUrl } from '../../utils/api';

const CreateBookingForm = ({ devices, setBookings }) => {
  const [selectedDevice, setSelectedDevice] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDevice || !startTime || !endTime) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    const newBooking = {
      deviceName: devices.find((device) => device.id === selectedDevice)?.name,
      deviceId: selectedDevice,
      startTime,
      endTime,
      status: 'Ожидает подтверждения', 
    };

    try {
      const response = await axios.post(`${apiUrl}/bookings`, newBooking);

      setBookings((prevBookings) => [...prevBookings, response.data]);

      setSelectedDevice('');
      setStartTime('');
      setEndTime('');
      alert('Бронирование успешно создано!');
    } catch (error) {
      console.error('Ошибка при создании бронирования:', error);
      alert('Не удалось создать бронирование');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Создать новое бронирование</h2>
      <p style={{color: 'gray', fontSize: '0.9em'}}>Примечание: бронирование доступно только в рабочее время с 8:30 до 17:00</p>
      <label>
        Выберите прибор:
        <select
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
        >
          <option value="">--Выберите прибор--</option>
          {devices.map((device) => (
            <option key={device.id} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Время начала:
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </label>
      <br />
      <label>
        Время окончания:
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </label>
      <br />
      <button type="submit">Создать бронирование</button>
    </form>
  );
};

export default CreateBookingForm;
