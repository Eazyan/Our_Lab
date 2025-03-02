import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UserSelection from './pages/UserSelection'; // Страница выбора роли
import Dashboard from './pages/Dashboard'; // Панель управления
import DeviceList from './pages/DeviceList'; // Список устройств
import Bookings from './pages/Bookings'; // Список бронирований
import Timeline from './pages/Timeline'; // Таймлайн
import AddDevice from './pages/AddDevice'; // Страница добавления устройства

function App() {
  const userRole = localStorage.getItem('userRole'); // Получаем роль из localStorage

  return (
    <Router>
      <Routes>
        <Route path="/" element={userRole ? <Navigate to="/dashboard" /> : <UserSelection />} />
        
        {/* Защищённые маршруты */}
        <Route path="/dashboard" element={userRole ? <Dashboard userRole={userRole} /> : <Navigate to="/" />} />
        <Route path="/timeline" element={userRole === 'teacher' || userRole === 'admin' || userRole === 'student' ? <Timeline /> : <Navigate to="/dashboard" />} />
        <Route path="/bookings" element={userRole === 'teacher' || userRole === 'admin' ? <Bookings /> : <Navigate to="/dashboard" />} />
        <Route path="/devices" element={userRole === 'admin' ? <DeviceList /> : <Navigate to="/dashboard" />} />
        <Route path="/add-device" element={userRole === 'admin' ? <AddDevice /> : <Navigate to="/dashboard" />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
