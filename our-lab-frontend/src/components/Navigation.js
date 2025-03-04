import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUserRole, logout } from '../utils/auth';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userRole = getUserRole();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-logo">
          Our Lab
        </Link>
        
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>
        
        <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <li>
            <Link 
              to="/dashboard" 
              className={location.pathname === '/dashboard' ? 'active' : ''}
            >
              Дашборд
            </Link>
          </li>
          <li>
            <Link 
              to="/timeline" 
              className={location.pathname === '/timeline' ? 'active' : ''}
            >
              Таймлайн
            </Link>
          </li>
          
          <li>
            <Link 
              to="/bookings" 
              className={location.pathname === '/bookings' ? 'active' : ''}
            >
              Бронирования
            </Link>
          </li>
          
          {(userRole === 'admin' || userRole === 'teacher') && (
            <li>
              <Link 
                to="/devices" 
                className={location.pathname === '/devices' ? 'active' : ''}
              >
                Приборы
              </Link>
            </li>
          )}
          
          <li>
            <Link 
              to="/profile" 
              className={location.pathname === '/profile' ? 'active' : ''}
            >
              Профиль
            </Link>
          </li>
          
          <li>
            <button onClick={handleLogout} className="logout-button">
              Выйти
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation; 