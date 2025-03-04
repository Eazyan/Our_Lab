import React, { useState, useEffect } from 'react';
import { getDevices } from '../utils/api';
import { toast } from 'react-toastify';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setIsLoading(true);
      const response = await getDevices();
      console.log('Ответ сервера:', response);
      
      // Проверяем, что response.data существует и является массивом
      if (response && response.data && Array.isArray(response.data)) {
        setDevices(response.data);
      } else {
        console.error('Неверный формат данных:', response);
        setError('Неверный формат данных от сервера');
        toast.error('Ошибка формата данных');
      }
    } catch (error) {
      console.error('Ошибка при получении списка приборов:', error);
      setError('Не удалось загрузить список приборов');
      toast.error('Ошибка при загрузке приборов');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!devices || devices.length === 0) {
    return <div className="no-devices">Нет доступных приборов</div>;
  }

  return (
    <div className="devices-container">
      <h2>Управление приборами</h2>
      <div className="devices-grid">
        {devices.map(device => (
          <div key={device.id} className="device-card">
            <h3>{device.name}</h3>
            <p className={`status ${device.available ? 'available' : 'unavailable'}`}>
              {device.available ? 'Доступен' : 'Недоступен'}
            </p>
            <p className="description">{device.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Devices; 