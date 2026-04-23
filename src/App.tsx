import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RoleProvider } from './contexts/RoleContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { MainDashboard } from './pages/MainDashboard';
import { TrainerPage } from './pages/TrainerPage';
import { AdminPage } from './pages/AdminPage';
import { TermsPage } from './pages/TermsPage';
import { DataProtectionPage } from './pages/DataProtectionPage';
import './index.css';

function App() {
  return (
    <RoleProvider>
      <Router>
        <div className="min-h-screen bg-secondary-50">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<MainDashboard />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="/trainer" element={<TrainerPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/terminos" element={<TermsPage />} />
            <Route path="/proteccion-datos" element={<DataProtectionPage />} />
          </Routes>
        </div>
      </Router>
    </RoleProvider>
  );
}

export default App;
