import React, { useState, useEffect } from 'react';
import { deviceService } from '../services/deviceService';
import { toast } from 'react-toastify';
import './Devices.css';

const Devices = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const fetchDevices = async () => {
        try {
            setLoading(true);
            const data = await deviceService.getDevices();
            setDevices(data);
        } catch (err) {
            setError('Ошибка загрузки приборов');
            console.error('Ошибка:', err);
            toast.error('Не удалось загрузить список приборов');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    const handleEdit = (device) => {
        setSelectedDevice(device);
        setIsEditing(true);
    };

    const handleCreate = () => {
        setSelectedDevice(null);
        setIsCreating(true);
    };

    const handleUpdate = async (updatedDevice) => {
        try {
            if (isCreating) {
                await deviceService.createDevice(updatedDevice);
                toast.success('Прибор успешно создан');
            } else {
                await deviceService.updateDevice(selectedDevice.id, updatedDevice);
                toast.success('Прибор успешно обновлен');
            }
            await fetchDevices();
            setIsEditing(false);
            setIsCreating(false);
            setSelectedDevice(null);
        } catch (err) {
            console.error('Ошибка:', err);
            toast.error(isCreating ? 'Не удалось создать прибор' : 'Не удалось обновить прибор');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот прибор?')) {
            try {
                await deviceService.deleteDevice(id);
                toast.success('Прибор успешно удален');
                await fetchDevices();
            } catch (err) {
                console.error('Ошибка:', err);
                toast.error('Не удалось удалить прибор');
            }
        }
    };

    const handleCloseModal = () => {
        setIsEditing(false);
        setIsCreating(false);
        setSelectedDevice(null);
    };

    if (loading) return <div className="loading">Загрузка...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="devices-container">
            <div className="devices-header">
                <h2>Список приборов</h2>
                <button onClick={handleCreate} className="create-button">
                    Добавить прибор
                </button>
            </div>

            <div className="devices-grid">
                {devices.map(device => (
                    <div key={device.id} className="device-card">
                        <h3>{device.name}</h3>
                        <p>{device.description}</p>
                        <p className={`status ${device.status}`}>
                            Статус: {device.status === 'available' ? 'Доступен' : 
                                    device.status === 'in_use' ? 'В использовании' : 
                                    'На обслуживании'}
                        </p>
                        <div className="device-actions">
                            <button onClick={() => handleEdit(device)} className="edit-button">
                                Редактировать
                            </button>
                            <button onClick={() => handleDelete(device.id)} className="delete-button">
                                Удалить
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {(isEditing || isCreating) && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{isCreating ? 'Создание прибора' : 'Редактирование прибора'}</h3>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            handleUpdate({
                                name: formData.get('name'),
                                description: formData.get('description'),
                                status: formData.get('status')
                            });
                        }}>
                            <div className="form-group">
                                <label htmlFor="name">Название прибора</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    defaultValue={selectedDevice?.name || ''}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Описание</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    defaultValue={selectedDevice?.description || ''}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="status">Статус</label>
                                <select 
                                    id="status"
                                    name="status" 
                                    defaultValue={selectedDevice?.status || 'available'}
                                >
                                    <option value="available">Доступен</option>
                                    <option value="in_use">В использовании</option>
                                    <option value="maintenance">На обслуживании</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-button">
                                    {isCreating ? 'Создать' : 'Сохранить'}
                                </button>
                                <button 
                                    type="button" 
                                    onClick={handleCloseModal}
                                    className="cancel-button"
                                >
                                    Отмена
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Devices; 