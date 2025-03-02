import React, { useState, useEffect } from 'react';
import { getDevices } from '../utils/api'; // Импортируем функцию для работы с API
import DeviceCard from '../components/Device/DeviceCard'; // Компонент для отображения каждого прибора

const DeviceList = () => {
  const [devices, setDevices] = useState([]); // Храним список приборов
  const [loading, setLoading] = useState(true); // Состояние загрузки

  useEffect(() => {
    // Загружаем список приборов при монтировании компонента
    const fetchDevices = async () => {
      try {
        const data = await getDevices();
        setDevices(data);
      } catch (error) {
        console.error('Ошибка при загрузке приборов:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDevices();
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div>
      <h2>Список приборов</h2>
      {devices.length > 0 ? (
        <div>
          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} setDevices={setDevices} />
          ))}
        </div>
      ) : (
        <p>Приборы не найдены.</p>
      )}
    </div>
  );
};

export default DeviceList;
