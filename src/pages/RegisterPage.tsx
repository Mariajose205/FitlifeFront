import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Dumbbell, Mail, Lock, User, Eye, EyeOff, Calendar, MapPin, Phone, AlertCircle } from 'lucide-react';
import { detectUserType, getUserRedirectPath, setAuthenticatedUser } from '../utils/userTypeDetection';
import { usuariosService } from '../services/api';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  address: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage: React.FC = () => {
  // Load saved form data from localStorage on mount
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = localStorage.getItem('fitlife_registration_draft');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch {
        return {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          birthDate: '',
          address: '',
          password: '',
          confirmPassword: '',
        };
      }
    }
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthDate: '',
      address: '',
      password: '',
      confirmPassword: '',
    };
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(() => {
    const savedData = localStorage.getItem('fitlife_registration_draft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return parsed.acceptTerms || false;
      } catch {
        return false;
      }
    }
    return false;
  });
  
  const [acceptDataProtection, setAcceptDataProtection] = useState(() => {
    const savedData = localStorage.getItem('fitlife_registration_draft');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return parsed.acceptDataProtection || false;
      } catch {
        return false;
      }
    }
    return false;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  // Detect user type based on email
  const detectedUserType = formData.email ? detectUserType(formData.email) : 'user';
  const userTypeLabels = {
    admin: 'Administrador',
    trainer: 'Entrenador',
    user: 'Usuario Normal'
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-save to localStorage
      localStorage.setItem('fitlife_registration_draft', JSON.stringify(newData));
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('Registration attempt:', { ...formData, acceptTerms, acceptDataProtection });
      
      // Prepare data for API
      const userData = {
        nombre: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        telefono: formData.phone,
        direccion: formData.address
      };
      
      // Call real API
      const response = await usuariosService.register(userData);
      console.log('User registered successfully:', response.data);
      
      // Clear form data from localStorage after successful registration
      localStorage.removeItem('fitlife_registration_draft');
      
      // Redirect to login page
      navigate('/login');
      
    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.response?.data?.error || 'Error al registrar usuario. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return formData.firstName && 
           formData.lastName && 
           formData.email && 
           formData.password && 
           formData.confirmPassword &&
           formData.password === formData.confirmPassword &&
           acceptTerms &&
           acceptDataProtection;
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
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
            Crear Cuenta
          </h1>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* User Type Detection */}
          {formData.email && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-blue-800">
                  <strong>Tipo de cuenta detectado:</strong> {userTypeLabels[detectedUserType]}
                </span>
              </div>
              <p className="text-xs text-blue-700 mt-2">
                El sistema detecta tu tipo de cuenta según tu dominio de email
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                  Nombre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input-field pl-10"
                    placeholder="Ingresa tu nombre"
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-2">
                  Apellido
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Ingresa tu apellido"
                />
              </div>
            </div>

            {/* Email */}
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
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Ingresa tu correo"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="+56 9 1234 5678"
                />
              </div>
            </div>

            {/* Birth Date */}
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-secondary-700 mb-2">
                Fecha de Nacimiento
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  required
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-secondary-700 mb-2">
                Dirección
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="input-field pl-10"
                  placeholder="Ingresa tu dirección"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
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
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="input-field pl-10 pr-10"
                    placeholder="Crea una contraseña"
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-2">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-secondary-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="input-field pl-10 pr-10"
                    placeholder="Confirma tu contraseña"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-4">
              <div className="bg-secondary-50 p-4 rounded-lg">
                <h3 className="font-semibold text-secondary-900 mb-2">Términos y Condiciones</h3>
                <div className="text-sm text-secondary-600 space-y-2">
                  <p>
                    Al registrarte en FitLife, aceptas nuestros términos de servicio y política de privacidad.
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={(e) => {
                          setAcceptTerms(e.target.checked);
                          // Save to localStorage
                          const savedData = localStorage.getItem('fitlife_registration_draft');
                          if (savedData) {
                            try {
                              const parsed = JSON.parse(savedData);
                              parsed.acceptTerms = e.target.checked;
                              localStorage.setItem('fitlife_registration_draft', JSON.stringify(parsed));
                            } catch {
                              console.error('Error saving terms acceptance');
                            }
                          }
                        }}
                        className="mt-1 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm">
                        Acepto los <Link to="/terminos" className="text-primary-600 hover:text-primary-700 underline">Términos y Condiciones</Link> de FitLife
                      </span>
                    </label>
                    
                    <label className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={acceptDataProtection}
                        onChange={(e) => {
                          setAcceptDataProtection(e.target.checked);
                          // Save to localStorage
                          const savedData = localStorage.getItem('fitlife_registration_draft');
                          if (savedData) {
                            try {
                              const parsed = JSON.parse(savedData);
                              parsed.acceptDataProtection = e.target.checked;
                              localStorage.setItem('fitlife_registration_draft', JSON.stringify(parsed));
                            } catch {
                              console.error('Error saving data protection acceptance');
                            }
                          }
                        }}
                        className="mt-1 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm">
                        Acepto la <Link to="/proteccion-datos" className="text-primary-600 hover:text-primary-700 underline">Política de Protección de Datos Personales</Link> conforme a la Ley N°19.628 de Chile
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Chile Data Protection Summary */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">🇨🇱 Protección de Datos - Chile</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• <strong>Finalidad:</strong> Gestión de servicios fitness y reservas</p>
                  <p>• <strong>Derechos:</strong> Acceso, rectificación, cancelación y oposición (ARCO)</p>
                  <p>• <strong>Responsable:</strong> FitLife Spa</p>
                  <p>• <strong>Contacto:</strong> protecciondatos@fitlife.cl</p>
                  <p>• Puedes ejercer tus derechos enviando un correo a protecciondatos@fitlife.cl</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creando Cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <span className="text-sm text-secondary-600">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Inicia Sesión
              </Link>
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};
