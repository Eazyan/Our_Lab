import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Для редиректа после успешного входа

const LoginPage = () => {
  const history = useHistory();

  // Состояние для хранения данных формы
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Для переключения между входом и регистрацией
  const [error, setError] = useState('');

  // Функция для обработки отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (isRegistering) {
        // Если регистрация, отправляем данные для создания нового пользователя
        response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      } else {
        // Если вход, отправляем данные для аутентификации
        response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Ошибка при входе или регистрации');
      }

      // Сохраняем токен в localStorage для дальнейшего использования
      localStorage.setItem('authToken', data.token);

      // Редиректим на главную страницу или страницу профиля
      history.push('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? 'Регистрация' : 'Вход'}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">{isRegistering ? 'Зарегистрироваться' : 'Войти'}</button>
      </form>

      <div>
        <button onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
