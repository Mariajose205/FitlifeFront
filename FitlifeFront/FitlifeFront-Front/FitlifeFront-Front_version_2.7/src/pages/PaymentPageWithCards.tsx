import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { pagosService, tarjetasService } from '../services/api';
import { CreditCard, AlertCircle } from 'lucide-react';

interface Tarjeta {
  id: number;
  idUsuario: number;
  tipo: 'CREDITO' | 'DEBITO';
  numero: string;
  titular: string;
  fechaVencimiento: string;
  cvv: string;
  saldo: number;
  porDefecto: boolean;
  fechaCreacion: string;
  activo: boolean;
}

interface PaymentData {
  id: number;
  idUsuario: number;
  idReserva: number;
  monto: number;
  fechaPago: string;
  metodoPago: string;
  estado: string;
}

const PaymentPageWithCards: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [selectedTarjeta, setSelectedTarjeta] = useState<Tarjeta | null>(null);
  const [loadingTarjetas, setLoadingTarjetas] = useState(false);

  // Cargar tarjetas del usuario
  const loadTarjetas = async () => {
    try {
      setLoadingTarjetas(true);
      const idUsuario = 1; // Simulado - en producción vendría del usuario autenticado
      const response = await tarjetasService.obtenerTarjetasPorUsuario(idUsuario);
      setTarjetas(response.data);
      
      // Seleccionar tarjeta predeterminada si existe
      const predeterminada = response.data.find((t: Tarjeta) => t.porDefecto);
      if (predeterminada) {
        setSelectedTarjeta(predeterminada);
      }
    } catch (err: any) {
      setError('Error al cargar tarjetas: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoadingTarjetas(false);
    }
  };

  useEffect(() => {
    loadTarjetas();
  }, []);

  // Cargar información del pago
  const loadPaymentInfo = async () => {
    try {
      setLoading(true);
      
      const reservaId = searchParams.get('id');
      const costo = searchParams.get('cost');

      if (reservaId && costo) {
        // Mostrar el costo recibido desde la página de reservas
        setPaymentData({
          id: 0,
          idUsuario: 1, // Simulado
          idReserva: parseInt(reservaId),
          monto: parseFloat(costo),
          fechaPago: new Date().toISOString(),
          metodoPago: 'TARJETA',
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
          metodoPago: 'TARJETA',
          estado: 'PENDIENTE'
        });
      }
    } catch (err) {
      setError('Error al cargar información de pago');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPaymentInfo();
  }, [searchParams]);

  const handleTarjetaChange = (tarjetaId: number) => {
    const tarjeta = tarjetas.find(t => t.id === tarjetaId);
    setSelectedTarjeta(tarjeta || null);
  };

  const handlePayment = async () => {
    if (!selectedTarjeta) {
      setError('Por favor selecciona una tarjeta');
      return;
    }

    if (!paymentData) {
      setError('No hay información de pago disponible');
      return;
    }

    try {
      setProcessingPayment(true);
      setError('');

      // Crear pago usando la tarjeta seleccionada
      const pagoData = {
        idUsuario: paymentData.idUsuario,
        idReserva: paymentData.idReserva,
        monto: paymentData.monto,
        metodoPago: selectedTarjeta.tipo === 'CREDITO' ? 'TARJETA_CREDITO' : 'TARJETA_DEBITO',
        estado: 'COMPLETADO'
      };

      await pagosService.crearPago(pagoData);

      // Actualizar saldo de la tarjeta (restar el monto del pago)
      const nuevoSaldo = selectedTarjeta.saldo - paymentData.monto;
      await tarjetasService.actualizarSaldoTarjeta(selectedTarjeta.id, nuevoSaldo);

      alert('Pago procesado exitosamente');
      navigate('/perfil');
      
    } catch (err: any) {
      setError('Error al procesar pago: ' + (err.response?.data?.message || err.message));
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Procesar Pago</h1>
          <p className="text-secondary-600">Selecciona una tarjeta y completa el pago de tu reserva</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">Información del Pago</h2>
            
            {paymentData && (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-secondary-500">ID de Reserva</div>
                  <div className="text-lg font-semibold text-secondary-900">{paymentData.idReserva}</div>
                </div>
                
                <div>
                  <div className="text-sm text-secondary-500">Monto a Pagar</div>
                  <div className="text-2xl font-bold text-green-600">${paymentData.monto.toLocaleString()}</div>
                </div>
                
                <div>
                  <div className="text-sm text-secondary-500">Fecha de Pago</div>
                  <div className="text-lg font-semibold text-secondary-900">
                    {new Date(paymentData.fechaPago).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">Seleccionar Tarjeta</h2>
            
            {loadingTarjetas ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando tarjetas...</p>
              </div>
            ) : tarjetas.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes tarjetas guardadas</h3>
                <p className="text-gray-600 mb-4">
                  Agrega una tarjeta primero para poder realizar el pago
                </p>
                <button
                  onClick={() => navigate('/metodos-pago')}
                  className="btn-primary"
                >
                  Agregar Tarjeta
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {tarjetas.map((tarjeta) => (
                  <div
                    key={tarjeta.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedTarjeta?.id === tarjeta.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleTarjetaChange(tarjeta.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {tarjeta.tipo === 'CREDITO' ? 'Tarjeta de Crédito' : 'Tarjeta de Débito'}
                          </div>
                          <div className="text-sm text-gray-600">{tarjeta.numero}</div>
                          <div className="text-sm text-gray-600">Titular: {tarjeta.titular}</div>
                          <div className="text-sm font-medium text-green-600">
                            Saldo: ${tarjeta.saldo.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      {tarjeta.porDefecto && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Predeterminada
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-4">
          <button
            onClick={() => navigate('/reservas')}
            className="flex-1 btn-secondary"
          >
            Volver a Reservas
          </button>
          
          <button
            onClick={handlePayment}
            disabled={!selectedTarjeta || processingPayment}
            className="flex-1 btn-primary disabled:opacity-50"
          >
            {processingPayment ? 'Procesando...' : 'Pagar Ahora'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default PaymentPageWithCards;
