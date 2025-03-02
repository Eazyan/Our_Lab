import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify'; // Для уведомлений
import 'react-toastify/dist/ReactToastify.css'; // Стили для уведомлений

const AddDevice = () => {
  const [device, setDevice] = useState({
    name: '',
    description: '',
    characteristics: '',
    available: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDevice((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Замените порт на 5001, если сервер работает на этом порту
      const response = await axios.post('http://127.0.0.1:5001/devices', device); // Путь к API
      toast.success('Устройство успешно добавлено!');
    } catch (error) {
      toast.error('Ошибка при добавлении устройства');
    }
  };

  return (
    <div className="add-device-container">
      <h2>Добавить новое устройство</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Название:</label>
          <input
            type="text"
            name="name"
            value={device.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Описание:</label>
          <input
            type="text"
            name="description"
            value={device.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Характеристики:</label>
          <input
            type="text"
            name="characteristics"
            value={device.characteristics}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Доступность:</label>
          <input
            type="checkbox"
            name="available"
            checked={device.available}
            onChange={() => setDevice((prevState) => ({ ...prevState, available: !prevState.available }))}
          />
        </div>
        <button type="submit">Добавить устройство</button>
      </form>
    </div>
  );
};

export default AddDevice;
