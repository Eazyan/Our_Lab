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
  try {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  } catch (error) {
    console.error('Ошибка при получении cookie:', error);
    return null;
  }
};

const removeCookie = (name) => {
  try {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  } catch (error) {
    console.error('Ошибка при удалении cookie:', error);
  }
};

export const getToken = () => {
  try {
    const token = getCookie(TOKEN_KEY);
    if (!token) return null;
    
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 <= Date.now();
    
    if (isExpired) {
      removeToken();
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Ошибка при получении токена:', error);
    removeToken();
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (!token) {
      removeToken();
      return;
    }
    
    setCookie(TOKEN_KEY, token, TOKEN_EXPIRY);
    const event = new Event('authStateChanged');
    window.dispatchEvent(event);
  } catch (error) {
    console.error('Ошибка при установке токена:', error);
    removeToken();
  }
};

export const removeToken = () => {
  removeCookie(TOKEN_KEY);
  const event = new Event('authStateChanged');
  window.dispatchEvent(event);
};

export const getUserRole = () => {
  try {
    const token = getToken();
    if (!token) return null;
    
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    console.error('Ошибка при получении роли пользователя:', error);
    removeToken();
    return null;
  }
};

export const isAuthenticated = () => {
  try {
    const token = getToken();
    if (!token) return false;
    
    const decoded = jwtDecode(token);
    const isExpired = decoded.exp * 1000 <= Date.now();
    return !isExpired;
  } catch (error) {
    console.error('Ошибка при проверке аутентификации:', error);
    removeToken();
    return false;
  }
};

export const logout = () => {
  removeToken();
  window.location.href = '/';
};