import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole'); // Получаем роль из localStorage

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <h2>Добро пожаловать на панель управления</h2>

      <div>
        {userRole === 'student' && (
          <p>Вы вошли как Студент. Вы можете только просматривать бронирования на таймлайне.</p>
        )}
        {userRole === 'teacher' && (
          <p>Вы вошли как Преподаватель. Вы можете создавать бронирования и просматривать таймлайн.</p>
        )}
        {userRole === 'admin' && (
          <p>Вы вошли как Администратор. Вы можете управлять всеми аспектами системы, включая добавление оборудования.</p>
        )}
      </div>

      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default Dashboard;
