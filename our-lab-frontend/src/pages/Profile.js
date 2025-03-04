import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, removeToken } from '../utils/auth';

const Profile = () => {
  const navigate = useNavigate();
  const role = getUserRole();

  const handleLogout = () => {
    localStorage.clear();
    removeToken();
    navigate('/');
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

  return (
    <div className="profile-container">
      <h2>Профиль пользователя</h2>
      <div className="profile-info">
        <p><strong>Роль:</strong> {getRoleName(role)}</p>
        <p><strong>Статус:</strong> Активный</p>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Выйти
      </button>
    </div>
  );
};

export default Profile; 