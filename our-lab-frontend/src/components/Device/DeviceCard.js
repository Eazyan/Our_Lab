import React, { useState } from 'react';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import axios from 'axios'; 

const DeviceCard = ({ device, setDevices }) => {
  const [status, setStatus] = useState(device.available ? 'Доступен' : 'Недоступен'); 

  const handleStatusChange = async () => {
    try {
      const newStatus = status === 'Доступен' ? 'Недоступен' : 'Доступен';
      const updatedDevice = { ...device, available: newStatus === 'Доступен' };
      
      await axios.patch(`http://127.0.0.1:5001/devices/${device.id}`, updatedDevice); 

      setStatus(newStatus);
      toast.success(`Статус устройства изменен на ${newStatus}`);
      
      setDevices(prevDevices => 
        prevDevices.map(dev => (dev.id === device.id ? { ...dev, available: updatedDevice.available } : dev))
      );
    } catch (error) {
      toast.error('Ошибка при изменении статуса устройства');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://127.0.0.1:5001/devices/${device.id}`);
      setDevices(prevDevices => prevDevices.filter(dev => dev.id !== device.id));
      toast.success('Устройство успешно удалено!');
    } catch (error) {
      toast.error('Ошибка при удалении устройства');
    }
  };

  return (
    <div className="device-card">
      <h3>{device.name}</h3>
      <p>{device.description}</p>
      <p>{device.characteristics}</p>
      <p>Статус: {status}</p>
      <button onClick={handleStatusChange}>Изменить статус</button>
      <button onClick={handleDelete}>Удалить</button>
    </div>
  );
};

export default DeviceCard;
