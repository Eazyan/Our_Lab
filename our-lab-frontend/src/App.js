import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Импортируем стили для уведомлений

import Login from './pages/Login'; // Форма входа
import Dashboard from './pages/Dashboard'; // Страница, на которую редиректим после успешного входа
import DeviceList from './pages/DeviceList'; // Страница с устройствами
import Bookings from './pages/Bookings'; // Страница с бронированиями
import Timeline from './pages/Timeline'; // Страница с таймлайном
import axios from 'axios';
import { apiUrl } from './utils/api'; // Импортируем apiUrl

function App() {
  const [bookings, setBookings] = useState([]);
  const [devices, setDevices] = useState([]);

  const isAuthenticated = !!localStorage.getItem('authToken'); // Проверка авторизации

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsData = await axios.get(`${apiUrl}/bookings`);
        const devicesData = await axios.get(`${apiUrl}/devices`);
        setBookings(bookingsData.data);
        setDevices(devicesData.data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        
        {/* Защищённые маршруты */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/devices" element={isAuthenticated ? <DeviceList /> : <Navigate to="/login" />} />
        <Route path="/timeline" element={isAuthenticated ? <Timeline /> : <Navigate to="/login" />} />
        <Route path="/bookings" element={isAuthenticated ? <Bookings bookings={bookings} devices={devices} setBookings={setBookings} /> : <Navigate to="/login" />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
