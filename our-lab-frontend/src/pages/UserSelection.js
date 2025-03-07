import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../utils/api';

const UserSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSelection = async (role) => {
    try {
      setIsLoading(true);
      setSelectedRole(role);
      
      await api.post('/auth/login', { role });
      
      toast.success(`Вы теперь ${role === 'student' ? 'Студент' : role === 'teacher' ? 'Преподаватель' : 'Администратор'}`);

      if (role === 'student') {
        navigate('/timeline');
      } else if (role === 'teacher') {
        navigate('/bookings');
      } else {
        navigate('/devices');
      }
    } catch (error) {
      toast.error('Ошибка при выборе роли. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-selection-container">
      <h2>Выберите роль</h2>
      <div>
        <button 
          onClick={() => handleRoleSelection('student')} 
          disabled={isLoading}
        >
          {isLoading && selectedRole === 'student' ? 'Загрузка...' : 'Студент'}
        </button>
        <button 
          onClick={() => handleRoleSelection('teacher')} 
          disabled={isLoading}
        >
          {isLoading && selectedRole === 'teacher' ? 'Загрузка...' : 'Преподаватель'}
        </button>
        <button 
          onClick={() => handleRoleSelection('admin')} 
          disabled={isLoading}
        >
          {isLoading && selectedRole === 'admin' ? 'Загрузка...' : 'Администратор'}
        </button>
      </div>
    </div>
  );
};

export default UserSelection;
