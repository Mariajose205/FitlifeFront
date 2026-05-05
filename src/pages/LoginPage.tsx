import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, Eye, EyeOff } from 'lucide-react';
// import { usuariosService } from '../services/api';
import { getUserRedirectPath, setAuthenticatedUser } from '../utils/userTypeDetection';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Simulación de autenticación - API deshabilitada para modo local
      // const response = await usuariosService.login({ email, password });
      // const { token, user } = response.data;
      
      // Usar autenticación simulada
      const domain = email.toLowerCase().split('@')[1];
      let role: 'admin' | 'trainer' | 'user';
      let name: string;
      
      if (domain === 'fitlife.cl') {
        if (email.toLowerCase().includes('admin')) {
          role = 'admin';
          name = 'Administrador FitLife';
        } else if (email.toLowerCase().includes('trainer')) {
          role = 'trainer';
          name = 'Entrenador';
        } else {
          role = 'user';
          name = 'Usuario';
        }
      } else {
        role = 'user';
        name = 'Usuario Normal';
      }
      
      const mappedUser = {
        id: '1',
        email: email,
        name: name,
        role: role,
        membershipType: role === 'admin' ? 'Administrador' : role === 'trainer' ? 'Entrenador' : 'Premium',
        memberSince: new Date().toISOString().split('T')[0]
      };
      
      setAuthenticatedUser(mappedUser);
      const redirectPath = getUserRedirectPath(mappedUser.role);
      navigate(redirectPath);
      
    } catch (error: any) {
      console.error('Error de autenticación:', error);
      
      // Fallback a simulación si la API no está disponible
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
        // Usar la lógica de simulación existente como fallback
        const domain = email.toLowerCase().split('@')[1];
        let role: 'admin' | 'trainer' | 'user' = 'user';
        
        if (domain.includes('admin') || domain === 'fitlife.cl') {
          role = 'admin';
        } else if (domain.includes('trainer') || domain.includes('entrenador')) {
          role = 'trainer';
        }
        
        const mockUser = {
          id: '1',
          email,
          name: email.split('@')[0],
          role,
          membershipType: role === 'admin' ? 'Admin' : 'Premium',
          memberSince: new Date().toISOString().split('T')[0]
        };
        
        setAuthenticatedUser(mockUser);
        const redirectPath = getUserRedirectPath(mockUser.role);
        navigate(redirectPath);
      } else {
        setError('Credenciales incorrectas. Por favor, intenta nuevamente.');
      }
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Simple Header with Logo Only */}
      <div className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900">FitLife</span>
            </div>
          </div>
        </div>
      </div>
      
      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="card p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-secondary-900">FitLife</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-secondary-900 text-center mb-8">
            Iniciar Sesión
          </h1>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Ingresa tu correo"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="Ingresa tu contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          {/* Registration Link */}
          <div className="mt-6 text-center">
            <div className="text-center text-sm text-secondary-600">
              ¿No tienes cuenta?{' '}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Regístrate
              </Link>
            </div>
            
            <div className="text-center text-sm text-secondary-600">
              ¿Olvidaste tu contraseña?{' '}
              <Link
                to="/forgot-password"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Recupérala aquí
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
