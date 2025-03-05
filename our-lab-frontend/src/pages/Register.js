import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        role: 'student',
        phone: '',
        group: '',
        department: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Валидация обязательных полей
            if (!formData.fullName || !formData.email || !formData.password) {
                toast.error('Пожалуйста, заполните все обязательные поля');
                return;
            }

            // Валидация email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                toast.error('Пожалуйста, введите корректный email');
                return;
            }

            // Валидация пароля
            if (formData.password.length < 6) {
                toast.error('Пароль должен содержать минимум 6 символов');
                return;
            }

            // Валидация роли
            if (!formData.role) {
                toast.error('Пожалуйста, выберите роль');
                return;
            }

            await authService.register(formData);
            toast.success('Регистрация успешна! Теперь вы можете войти.');
            navigate('/login');
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            if (error.response?.data?.detail) {
                toast.error(error.response.data.detail);
            } else {
                toast.error('Произошла ошибка при регистрации');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Регистрация</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="fullName">ФИО *</label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            placeholder="Введите ваше полное имя"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="example@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Минимум 6 символов"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Роль *</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Выберите роль</option>
                            <option value="student">Студент</option>
                            <option value="teacher">Преподаватель</option>
                            <option value="admin">Администратор</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Телефон</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+7 (XXX) XXX-XX-XX"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="group">Группа</label>
                        <input
                            type="text"
                            id="group"
                            name="group"
                            value={formData.group}
                            onChange={handleChange}
                            placeholder="Например: ИВТ-101"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="department">Кафедра</label>
                        <input
                            type="text"
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            placeholder="Например: Кафедра информатики"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="submit-button">
                        {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                    </button>
                </form>
                <p className="auth-link">
                    Уже есть аккаунт? <a href="/login">Войти</a>
                </p>
            </div>
        </div>
    );
};

export default Register; 