import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { setToken } from '../utils/auth';

const EntryPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'student'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      console.log('Попытка входа с данными:', {
        username: formData.username,
        password: '***'
      });
      
      const response = await api.post('/auth/login', { 
        username: formData.username, 
        password: formData.password 
      });
      
      console.log('Ответ сервера при входе:', response.data);
      
      if (response.data && response.data.access_token) {
        setToken(response.data.access_token);
        console.log('Токен успешно сохранен');
        toast.success('Вход выполнен успешно!');
        
        setTimeout(() => {
          console.log('Выполняем навигацию на /dashboard');
          window.location.href = '/dashboard';
        }, 100);
      } else {
        console.error('Токен не получен от сервера');
        setError('Не удалось получить токен доступа от сервера');
      }
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      if (error.response) {
        setError(error.response.data?.detail || 'Неверное имя пользователя или пароль');
      } else if (error.code === 'ERR_NETWORK') {
        setError('Не удалось соединиться с сервером. Проверьте, запущен ли бэкенд.');
      } else {
        setError('Ошибка соединения с сервером');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.email) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      console.log('Отправка данных регистрации:', formData);
      
      const response = await api.post('/auth/register', { 
        username: formData.username, 
        password: formData.password,
        email: formData.email,
        role: formData.role 
      });
      
      console.log('Ответ сервера при регистрации:', response.data);
      toast.success('Регистрация успешна!');
      
      console.log('Попытка автоматического входа...');
      const loginResponse = await api.post('/auth/login', {
        username: formData.username,
        password: formData.password
      });
      
      console.log('Ответ сервера при автоматическом входе:', loginResponse.data);
      
      if (loginResponse.data && loginResponse.data.access_token) {
        setToken(loginResponse.data.access_token);
        toast.success('Вход выполнен автоматически!');
        
        setTimeout(() => {
          console.log('Выполняем навигацию на /dashboard');
          window.location.href = '/dashboard';
        }, 100);
      } else {
        setIsLogin(true);
      }
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      if (error.response) {
        setError(error.response.data?.detail || 'Ошибка при регистрации. Возможно, пользователь уже существует.');
      } else if (error.code === 'ERR_NETWORK') {
        setError('Не удалось соединиться с сервером. Проверьте, запущен ли бэкенд.');
      } else {
        setError('Ошибка соединения с сервером');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="entry-container">
      <div className="entry-card">
        <h2>{isLogin ? 'Вход в систему' : 'Регистрация'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={isLogin ? handleLogin : handleRegister}>
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Введите имя пользователя"
              disabled={isLoading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Введите пароль"
              disabled={isLoading}
            />
          </div>
          
          {!isLogin && (
            <>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Введите email"
                  disabled={isLoading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Выберите роль (только для разработки)</label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  disabled={isLoading}
                >
                  <option value="student">Студент</option>
                  <option value="teacher">Преподаватель</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
            </>
          )}
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
        
        <div className="toggle-container">
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            className="toggle-button"
            disabled={isLoading}
          >
            {isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт?'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EntryPage; 