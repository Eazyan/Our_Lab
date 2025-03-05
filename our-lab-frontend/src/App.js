import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import EntryPage from './pages/EntryPage';
import Dashboard from './pages/Dashboard';
import Timeline from './pages/Timeline';
import Bookings from './pages/Bookings';
import Devices from './pages/Devices';
import Profile from './pages/Profile';
import Register from './pages/Register';
import Navigation from './components/Navigation';
import { getUserRole, isAuthenticated } from './utils/auth';
import { ToastContainer } from 'react-toastify';
import './styles/App.css';
import './styles/Navigation.css';
import './styles/Profile.css';
import './styles/Devices.css';
import './styles/Dashboard.css';
import './styles/EntryPage.css';
import './styles/Bookings.css';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [userRole, setUserRole] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      
      if (authenticated) {
        const role = getUserRole();
        setUserRole(role);
        console.log('Пользователь аутентифицирован, роль:', role);
      } else {
        setUserRole(null);
        console.log('Пользователь не аутентифицирован');
      }
      
      setIsLoading(false);
    };

    checkAuth();
    
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('authStateChanged', handleAuthChange);
    
    const interval = setInterval(checkAuth, 5 * 60 * 1000);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('authStateChanged', handleAuthChange);
    };
  }, []);

  if (isLoading) {
    return <div className="loading">Загрузка...</div>;
  }

  return (
    <Router>
      <div className="app">
        {isAuth && <Navigation />}
        <main className={isAuth ? "main-content" : "full-content"}>
          <Routes>
            <Route path="/" element={isAuth ? <Navigate to="/dashboard" /> : <EntryPage />} />
            <Route path="/register" element={!isAuth ? <Register /> : <Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/timeline" element={isAuth ? <Timeline /> : <Navigate to="/" />} />
            <Route 
              path="/bookings" 
              element={
                isAuth && (userRole === 'teacher' || userRole === 'admin' || userRole === 'student') 
                  ? <Bookings /> 
                  : <Navigate to="/dashboard" />
              } 
            />
            <Route 
              path="/devices" 
              element={
                isAuth && (userRole === 'admin' || userRole === 'teacher') 
                  ? <Devices /> 
                  : <Navigate to="/dashboard" />
              } 
            />
            <Route path="/profile" element={isAuth ? <Profile /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;
