import React, { useState } from 'react';
import axios from 'axios';

const DeviceCard = ({ device, setDevices }) => {
  const [status, setStatus] = useState(device.available ? 'Доступен' : 'Не доступен');

  // Функция для изменения статуса устройства
  const handleStatusChange = async () => {
    const newStatus = status === 'Доступен' ? 'Не доступен' : 'Доступен';
    setStatus(newStatus);

    try {
      // Отправляем обновленный статус на сервер
      await axios.patch(`http://localhost:5001/devices/${device.id}`, { available: newStatus === 'Доступен' });
      alert(`Статус прибора "${device.name}" изменен на: ${newStatus}`);
    } catch (error) {
      console.error('Ошибка при обновлении статуса:', error);
      alert('Не удалось обновить статус прибора.');
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px' }}>
      <h3>{device.name}</h3>
      <p><strong>Описание:</strong> {device.description}</p>
      <p><strong>Доступность:</strong> {status}</p>
      <p><strong>Характеристики:</strong> {device.characteristics}</p>
      <button onClick={handleStatusChange}>Изменить статус</button> {/* Здесь вызываем функцию */}
    </div>
  );
};

export default DeviceCard;
