import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validación básica
    if (!email) {
      setError('Por favor ingresa tu correo electrónico');
      setIsSubmitting(false);
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Por favor ingresa un correo electrónico válido');
      setIsSubmitting(false);
      return;
    }

    // Simulación de envío de correo
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      setError('Error al enviar el correo. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />
        
        <main className="max-w-md mx-auto px-4 py-20">
          <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-8">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-secondary-900 mb-4">
                ¡Correo Enviado!
              </h1>
              <p className="text-secondary-600 mb-2">
                Hemos enviado un enlace de recuperación a:
              </p>
              <p className="font-semibold text-primary-600 break-all">
                {email}
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Próximos pasos:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>1. Revisa tu bandeja de entrada</li>
                <li>2. Busca el correo de FitLife</li>
                <li>3. Haz clic en el enlace de recuperación</li>
                <li>4. Sigue las instrucciones para cambiar tu contraseña</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                to="/login"
                className="w-full btn-primary flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio de Sesión
              </Link>
              
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setEmail('');
                }}
                className="w-full btn-secondary"
              >
                Enviar a otro correo
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Simple Header with Logo Only */}
      <div className="bg-white shadow-sm border-b border-secondary-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-secondary-900">FitLife</span>
            </div>
          </div>
        </div>
      </div>
      
      <main className="max-w-md mx-auto px-4 py-20">
        {/* Back Button */}
        <Link
          to="/login"
          className="inline-flex items-center text-secondary-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al Inicio de Sesión
        </Link>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="text-secondary-600">
              No te preocupes, te enviaremos un enlace para que puedas recuperarla
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  Enviar Enlace de Recuperación
                </>
              )}
            </button>
          </form>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-secondary-200">
            <div className="text-center text-sm text-secondary-600">
              <p className="mb-2">¿Necesitas ayuda?</p>
              <div className="space-y-1">
                <p>• Revisa tu carpeta de spam</p>
                <p>• Asegúrate que el correo esté registrado</p>
                <p>• Contacta a soporte si continúas con problemas</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
