import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, removeToken } from '../utils/auth';
import { profileService } from '../services/profileService';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const role = getUserRole();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    group: '',
    department: ''
  });
  const [stats, setStats] = useState({
    total_bookings: 0,
    active_bookings: 0,
    completed_bookings: 0,
    cancelled_bookings: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [profileData, statsData] = await Promise.all([
          profileService.getProfile(),
          profileService.getStats()
        ]);
        
        const formattedProfileData = {
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          group: profileData.group || '',
          department: profileData.department || ''
        };
        
        setUserData(formattedProfileData);
        setStats(statsData);
      } catch (err) {
        setError('Ошибка загрузки данных профиля');
        console.error('Ошибка:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    removeToken();
    navigate('/');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await profileService.updateProfile(userData);
      setIsEditing(false);
    } catch (err) {
      setError('Ошибка сохранения профиля');
      console.error('Ошибка:', err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'student':
        return 'Студент';
      case 'teacher':
        return 'Преподаватель';
      case 'admin':
        return 'Администратор';
      default:
        return 'Неизвестная роль';
    }
  };

  if (isLoading) {
    return <div className="profile-container">Загрузка...</div>;
  }

  if (error) {
    return <div className="profile-container error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {userData.name.charAt(0)}
        </div>
        <div className="profile-title">
          <h2>{userData.name}</h2>
          <p>{getRoleName(role)}</p>
        </div>
      </div>

      <div className="profile-info">
        <div className="info-section">
          <h3>Основная информация</h3>
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                value={userData.name}
                onChange={(e) => setUserData({...userData, name: e.target.value})}
                placeholder="ФИО"
              />
              <input
                type="email"
                value={userData.email}
                onChange={(e) => setUserData({...userData, email: e.target.value})}
                placeholder="Email"
              />
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData({...userData, phone: e.target.value})}
                placeholder="Телефон"
              />
              <input
                type="text"
                value={userData.group}
                onChange={(e) => setUserData({...userData, group: e.target.value})}
                placeholder="Группа"
              />
              <input
                type="text"
                value={userData.department}
                onChange={(e) => setUserData({...userData, department: e.target.value})}
                placeholder="Кафедра"
              />
              <div className="profile-actions">
                <button onClick={handleSave}>Сохранить</button>
                <button type="button" onClick={handleCancel}>Отмена</button>
              </div>
            </div>
          ) : (
            <>
              <p><strong>Email:</strong> {userData.email}</p>
              <p><strong>Телефон:</strong> {userData.phone || 'Не указан'}</p>
              <p><strong>Группа:</strong> {userData.group || 'Не указана'}</p>
              <p><strong>Кафедра:</strong> {userData.department || 'Не указана'}</p>
            </>
          )}
        </div>

        <div className="info-section">
          <h3>Статистика бронирований</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{stats.total_bookings}</span>
              <span className="stat-label">Всего</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.active_bookings}</span>
              <span className="stat-label">Активные</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.completed_bookings}</span>
              <span className="stat-label">Завершенные</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.cancelled_bookings}</span>
              <span className="stat-label">Отмененные</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        {!isEditing && (
          <button onClick={handleEdit} className="edit-button">
            Редактировать профиль
          </button>
        )}
        <button onClick={handleLogout} className="logout-button">
          Выйти
        </button>
      </div>
    </div>
  );
};

export default Profile; 