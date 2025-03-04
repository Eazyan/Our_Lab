import jwtDecode from 'jwt-decode';

// Функция для получения токена из куки
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const getToken = () => {
  return getCookie('token');
};

export const removeToken = () => {
  // Удаляем куки, устанавливая прошедшую дату
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
};

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.role;
  } catch (error) {
    console.error('Ошибка при декодировании токена:', error);
    removeToken();
    return null;
  }
};

export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};