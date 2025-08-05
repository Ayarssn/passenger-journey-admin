import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/Auth';
import { ThemeProvider } from './context/Theme';
import { TowingProvider } from './context/Towing';
import { NotificationProvider } from './context/Notification';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import AdminDashboard from './pages/AdminDashboard';
import PassengerDashboard from './pages/PassengerDashboard';
import NotFound from './pages/NotFound';
import './styles/globals.css';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TowingProvider>
          <NotificationProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/dashboard" element={<PassengerDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </NotificationProvider>
        </TowingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
