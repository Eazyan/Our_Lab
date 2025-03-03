import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UserSelection from './pages/UserSelection';
import Dashboard from './pages/Dashboard';
import DeviceList from './pages/DeviceList';
import Bookings from './pages/Bookings';
import Timeline from './pages/Timeline';
import AddDevice from './pages/AddDevice';

function App() {
  const userRole = localStorage.getItem('userRole');

  return (
    <Router>
      <Routes>
        <Route path="/" element={userRole ? <Navigate to="/dashboard" /> : <UserSelection />} />
        
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
