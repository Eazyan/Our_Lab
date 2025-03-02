import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Для уведомлений
import 'react-toastify/dist/ReactToastify.css'; // Стили для уведомлений

const UserSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');

  // Функция для сохранения выбранной роли и редиректа
  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    localStorage.setItem('userRole', role); // Сохраняем роль в localStorage
    toast.success(`Вы теперь ${role === 'student' ? 'Студент' : role === 'teacher' ? 'Преподаватель' : 'Администратор'}`); // Уведомление

    // В зависимости от роли перенаправляем на нужную страницу
    if (role === 'student') {
      navigate('/timeline'); // Студент — только таймлайн
    } else if (role === 'teacher') {
      navigate('/bookings'); // Преподаватель — таймлайн и бронирования
    } else {
      navigate('/devices'); // Администратор — все страницы
    }
  };

  return (
    <div className="user-selection-container">
      <h2>Выберите роль</h2>
      <div>
        <button onClick={() => handleRoleSelection('student')}>Студент</button>
        <button onClick={() => handleRoleSelection('teacher')}>Преподаватель</button>
        <button onClick={() => handleRoleSelection('admin')}>Администратор</button>
      </div>
    </div>
  );
};

export default UserSelection;
