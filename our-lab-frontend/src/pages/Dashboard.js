import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Панель управления</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <Link to="/devices" style={{ padding: '10px', background: '#f0f0f0', borderRadius: '5px', textDecoration: 'none', color: '#333' }}>
          Список приборов
        </Link>
        <Link to="/bookings" style={{ padding: '10px', background: '#f0f0f0', borderRadius: '5px', textDecoration: 'none', color: '#333' }}>
          Бронирования
        </Link>
        <Link to="/timeline" style={{ padding: '10px', background: '#f0f0f0', borderRadius: '5px', textDecoration: 'none', color: '#333' }}>
          Расписание
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
