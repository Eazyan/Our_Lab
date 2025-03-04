import jwtDecode from 'jwt-decode';

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY = 7;

const setCookie = (name, value, days) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Strict`;
};

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const removeCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

export const getToken = () => {
  const token = getCookie(TOKEN_KEY);
  console.log('Получение токена:', token ? 'Токен найден' : 'Токен не найден');
  return token;
};

export const setToken = (token) => {
  console.log('Сохранение токена...');
  setCookie(TOKEN_KEY, token, TOKEN_EXPIRY);
  console.log('Токен сохранен в куки');
  
  const event = new Event('authStateChanged');
  window.dispatchEvent(event);
};

export const removeToken = () => {
  console.log('Удаление токена...');
  removeCookie(TOKEN_KEY);
  console.log('Токен удален из куки');
};

export const getUserRole = () => {
  const token = getToken();
  if (!token) {
    console.log('Токен отсутствует, роль не определена');
    return null;
  }
  
  try {
    const decoded = jwtDecode(token);
    console.log('Роль пользователя:', decoded.role);
    return decoded.role;
  } catch (error) {
    console.error('Ошибка при декодировании токена:', error);
    removeToken();
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) {
    console.log('Токен отсутствует, пользователь не аутентифицирован');
    return false;
  }
  
  try {
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 <= Date.now();
    console.log('Проверка аутентификации:', isExpired ? 'Токен истек' : 'Токен действителен');
    return !isExpired;
  } catch (error) {
    console.error('Ошибка при проверке аутентификации:', error);
    return false;
  }
};

export const logout = () => {
  console.log('Выход из системы...');
  removeToken();
  window.location.href = '/';
};