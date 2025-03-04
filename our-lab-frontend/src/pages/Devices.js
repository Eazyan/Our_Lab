import React, { useState, useEffect } from 'react';
import { getDevices, apiUrl } from '../utils/api';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken } from '../utils/auth';
import '../styles/Devices.css';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'available'
  });

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      const data = await getDevices();
      setDevices(data);
    } catch (error) {
      console.error('Ошибка при загрузке устройств:', error);
      toast.error('Не удалось загрузить список устройств');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const response = await axios.post(`${apiUrl}/devices`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setDevices(prev => [...prev, response.data]);
      setShowForm(false);
      setFormData({ name: '', description: '', status: 'available' });
      toast.success('Устройство успешно добавлено');
    } catch (error) {
      console.error('Ошибка при добавлении устройства:', error);
      toast.error('Не удалось добавить устройство');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = getToken();
      await axios.delete(`${apiUrl}/devices/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setDevices(prev => prev.filter(device => device.id !== id));
      toast.success('Устройство успешно удалено');
    } catch (error) {
      console.error('Ошибка при удалении устройства:', error);
      toast.error('Не удалось удалить устройство');
    }
  };

  if (isLoading) {
    return (
      <div className="devices-container loading">
        <p>Загрузка устройств...</p>
      </div>
    );
  }

  return (
    <div className="devices-container">
      <h2>Управление оборудованием</h2>
      
      <div className="devices-actions">
        <button 
          className="add-device-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Отменить' : 'Добавить устройство'}
        </button>
      </div>

      {showForm && (
        <div className="device-form">
          <h3>Новое устройство</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Название:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Описание:</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Статус:</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="available">Доступно</option>
                <option value="in_use">В использовании</option>
                <option value="maintenance">На обслуживании</option>
              </select>
            </div>

            <button type="submit">Добавить</button>
          </form>
        </div>
      )}

      <div className="devices-list">
        {devices && devices.length > 0 ? (
          devices.map(device => (
            <div key={device.id} className="device-card">
              <div className="device-info">
                <h3>{device.name}</h3>
                <p>{device.description}</p>
                <span className={`status-badge status-${device.status}`}>
                  {device.status === 'available' && 'Доступно'}
                  {device.status === 'in_use' && 'В использовании'}
                  {device.status === 'maintenance' && 'На обслуживании'}
                </span>
              </div>
              <div className="device-actions">
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(device.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-devices">
            <p>Нет доступных устройств</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Devices; 