import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../utils/api';
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
      
      const data = await login({ 
        username: formData.username, 
        password: formData.password 
      });
      
      if (data && data.access_token) {
        setToken(data.access_token);
        toast.success('Вход выполнен успешно!');
        navigate('/dashboard');
      } else {
        setError('Не удалось получить токен доступа от сервера');
      }
    } catch (error) {
      setError(error.message || 'Ошибка при входе в систему');
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
      
      await register({ 
        username: formData.username, 
        password: formData.password,
        email: formData.email,
        role: formData.role 
      });
      
      toast.success('Регистрация успешна!');
      
      const loginData = await login({
        username: formData.username,
        password: formData.password
      });
      
      if (loginData && loginData.access_token) {
        setToken(loginData.access_token);
        toast.success('Вход выполнен автоматически!');
        navigate('/dashboard');
      } else {
        setIsLogin(true);
      }
    } catch (error) {
      setError(error.message || 'Ошибка при регистрации');
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
                <label htmlFor="role">Выберите роль</label>
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