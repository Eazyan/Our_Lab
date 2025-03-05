import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth';

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = getUserRole();
  

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-container">
      <h1>Панель управления</h1>
      
      <div className="dashboard-cards">
        <div className="dashboard-card" onClick={() => handleNavigation('/timeline')}>
          <div className="card-icon timeline-icon"></div>
          <h3>Таймлайн</h3>
          <p>Просмотр расписания и доступности оборудования</p>
        </div>
        
        {(userRole === 'teacher' || userRole === 'admin') && (
          <div className="dashboard-card" onClick={() => handleNavigation('/bookings')}>
            <div className="card-icon bookings-icon"></div>
            <h3>Бронирования</h3>
            <p>Управление забронированным оборудованием</p>
          </div>
        )}
        
        {userRole === 'admin' && (
          <div className="dashboard-card" onClick={() => handleNavigation('/devices')}>
            <div className="card-icon devices-icon"></div>
            <h3>Приборы</h3>
            <p>Управление лабораторным оборудованием</p>
          </div>
        )}
        
        <div className="dashboard-card" onClick={() => handleNavigation('/profile')}>
          <div className="card-icon profile-icon"></div>
          <h3>Профиль</h3>
          <p>Информация о вашем аккаунте</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
