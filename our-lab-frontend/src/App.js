import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Импортируем стили для уведомлений

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DeviceList from './pages/DeviceList';
import Bookings from './pages/Bookings';
import axios from 'axios';
import Timeline from './pages/Timeline';

function App() {
  const [bookings, setBookings] = useState([]);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingsData = await axios.get('http://localhost:5001/bookings');
        const devicesData = await axios.get('http://localhost:5001/devices');
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
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/devices" element={<DeviceList />} />
        <Route path="/timeline" element={<Timeline />} />

        <Route
          path="/bookings"
          element={<Bookings bookings={bookings} devices={devices} setBookings={setBookings} />}
        />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
