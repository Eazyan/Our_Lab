import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserRole } from '../utils/auth';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Получаем информацию о пользователе из токена
    const role = getUserRole();
    setUserRole(role);
    
    // В реальном приложении здесь будет запрос к API для получения полной информации о пользователе
    // Для демонстрации используем имитацию загрузки данных
    setTimeout(() => {
      // Имитация получения имени пользователя
      setUserName(role === 'admin' ? 'Администратор' : role === 'teacher' ? 'Преподаватель' : 'Студент');
      setIsLoading(false);
    }, 1000);
  }, []);

  // Определяем доступные карточки в зависимости от роли пользователя
  const getAvailableCards = () => {
    const cards = [
      {
        id: 'timeline',
        title: 'Расписание',
        description: 'Просмотр расписания использования оборудования',
        icon: '📅',
        link: '/timeline'
      },
      {
        id: 'bookings',
        title: 'Мои бронирования',
        description: 'Управление вашими бронированиями оборудования',
        icon: '📋',
        link: '/bookings'
      },
      {
        id: 'profile',
        title: 'Профиль',
        description: 'Просмотр и редактирование вашего профиля',
        icon: '👤',
        link: '/profile'
      }
    ];

    // Добавляем карточку устройств только для администраторов и преподавателей
    if (userRole === 'admin' || userRole === 'teacher') {
      cards.push({
        id: 'devices',
        title: 'Оборудование',
        description: 'Управление оборудованием лаборатории',
        icon: '🔧',
        link: '/devices'
      });
    }

    return cards;
  };

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Добро пожаловать, {userName}!</h1>
        <p>Панель управления лабораторией</p>
      </div>

      <div className="dashboard-cards">
        {getAvailableCards().map(card => (
          <Link to={card.link} key={card.id} className="dashboard-card">
            <div className="card-icon">{card.icon}</div>
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </Link>
        ))}
      </div>

      <div className="dashboard-info">
        <h2>Информация о лаборатории</h2>
        <p>
          Наша лаборатория оснащена современным оборудованием для проведения 
          исследований и экспериментов. Используйте систему бронирования для 
          планирования вашей работы с оборудованием.
        </p>
      </div>
    </div>
  );
};

export default Dashboard; 