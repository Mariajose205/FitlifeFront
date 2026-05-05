import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { RoleProvider } from './contexts/RoleContext';
import { DiscountProvider } from './contexts/DiscountContext';
import { CartProvider } from './contexts/CartContext';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { MainDashboard } from './pages/MainDashboard';
import { ProfilePage } from './pages/ProfilePage';
import { TrainerPage } from './pages/TrainerPage';
import { AdminPage } from './pages/AdminPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { TrainerDashboard } from './pages/TrainerDashboard';
import { ReservationsPage } from './pages/ReservationsPage';
import { GymsPage } from './pages/GymsPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { TermsPage } from './pages/TermsPage';
import { DataProtectionPage } from './pages/DataProtectionPage';
import './index.css';

function App() {
  return (
    <RoleProvider>
      <DiscountProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-secondary-50">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/dashboard" element={<MainDashboard />} />
                <Route path="/perfil" element={<ProfilePage />} />
                <Route path="/trainer" element={<TrainerPage />} />
                <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/reservas" element={<ReservationsPage />} />
                <Route path="/gimnasios" element={<GymsPage />} />
                <Route path="/pagos" element={<PaymentsPage />} />
                <Route path="/terminos" element={<TermsPage />} />
                <Route path="/proteccion-datos" element={<DataProtectionPage />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </DiscountProvider>
    </RoleProvider>
  );
}

export default App;
