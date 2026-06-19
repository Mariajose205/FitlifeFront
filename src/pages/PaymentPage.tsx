import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pagosService } from '../services/api';

interface PaymentData {
  id: number;
  idUsuario: number;
  idReserva: number;
  monto: number;
  fechaPago: string;
  metodoPago: string;
  estado: string;
}

interface PaymentRequest {
  idUsuario: number;
  idReserva: number;
  idMetodo: number;
  monto: number;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);

  // Simular datos de reserva (en producción vendrían de la página de reservas)
  const mockReservationData = {
    id: 1,
    idUsuario: 1,
    idHorario: 1,
    idLocation: 1,
    fechaReserva: new Date().toISOString(),
    estado: 'ACTIVA'
  };

  useEffect(() => {
    // Leer parámetros de la URL
    const reservaId = searchParams.get('id');
    const costo = searchParams.get('cost');

    // Cargar información del pago
    const loadPaymentInfo = async () => {
      try {
        setLoading(true);
        
        if (reservaId && costo) {
          // Mostrar el costo recibido desde la página de reservas
          setPaymentData({
            id: 0,
            idUsuario: 1, // Simulado
            idReserva: parseInt(reservaId),
            monto: parseFloat(costo),
            fechaPago: new Date().toISOString(),
            metodoPago: 'TRANSFERENCIA',
            estado: 'PENDIENTE'
          });
        } else {
          // Datos por defecto si no vienen parámetros
          setPaymentData({
            id: 0,
            idUsuario: 1,
            idReserva: 1,
            monto: 25000,
            fechaPago: new Date().toISOString(),
            metodoPago: 'TRANSFERENCIA',
            estado: 'PENDIENTE'
          });
        }
      } catch (err) {
        setError('Error al cargar información de pago');
      } finally {
        setLoading(false);
      }
    };

    loadPaymentInfo();
  }, [searchParams]);

  const handlePayment = async () => {
    if (!paymentData) return;

    try {
      setProcessingPayment(true);
      setError('');

      const paymentRequest: PaymentRequest = {
        idUsuario: paymentData.idUsuario,
        idReserva: paymentData.idReserva,
        idMetodo: 1, // Transferencia
        monto: paymentData.monto
      };

      const response = await pagosService.crearPago(paymentRequest);
      
      // Simular redirección a página de confirmación
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (err: any) {
      setError('Error al procesar el pago: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información de pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Procesar Pago</h1>
          <p className="mt-2 text-gray-600">Completa el pago para confirmar tu reserva</p>
        </div>

        {/* Resumen de Reserva */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen de Reserva</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">ID Reserva:</span>
              <span className="font-medium">#{mockReservationData.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fecha Reserva:</span>
              <span className="font-medium">
                {new Date(mockReservationData.fechaReserva).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado:</span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                {mockReservationData.estado}
              </span>
            </div>
          </div>
        </div>

        {/* Detalles del Pago */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detalles del Pago</h2>
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 00016zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 011.414 0l4 4a1 1 0 001.414-1.414l-1.293-1.293a1 1 0 00-1.414 1.414L9 10.586 7.707 14.707a1 1 0 01-1.414 0l-4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-medium text-gray-900">Total a Pagar:</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${paymentData?.monto.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Método de Pago
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="1">Transferencia Bancaria</option>
                  <option value="2">Tarjeta de Crédito</option>
                  <option value="3">Tarjeta de Débito</option>
                  <option value="4">Efectivo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Cuenta (simulado)
                </label>
                <input
                  type="text"
                  placeholder="****-****-****-****"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          
          <button
            onClick={handlePayment}
            disabled={processingPayment}
            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {processingPayment ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8 8 8 0 01-8 8z"></path>
                </svg>
                Procesando...
              </span>
            ) : (
              'Pagar Ahora'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
