import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { tarjetasService } from '../services/api';
import { getAuthenticatedUser } from '../utils/userTypeDetection';
import { CreditCard, Plus, Trash2, AlertCircle } from 'lucide-react';

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

const PaymentMethodsPage: React.FC = () => {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<Tarjeta[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    tipo: 'CREDITO' as 'CREDITO' | 'DEBITO',
    numero: '',
    titular: '',
    fechaVencimiento: '',
    cvv: '',
    saldo: '',
    porDefecto: false
  });

  // Load payment methods
  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const currentUser = getAuthenticatedUser();
      if (!currentUser || !currentUser.id) {
        setError('Usuario no autenticado');
        return;
      }
      const response = await tarjetasService.obtenerTarjetasPorUsuario(parseInt(currentUser.id));
      setPaymentMethods(response.data);
    } catch (err: any) {
      setError('Error al cargar métodos de pago: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadPaymentMethods();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;
    const checked = target.checked;
    
    let processedValue = value;
    
    // Formatear fecha de vencimiento como MM/AA
    if (name === 'fechaVencimiento') {
      processedValue = value.replace(/\D/g, ''); // Solo números
      if (processedValue.length >= 2) {
        processedValue = processedValue.slice(0, 2) + '/' + processedValue.slice(2, 4);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Validar formulario
      if (!formData.numero || !formData.titular || !formData.fechaVencimiento || !formData.cvv || !formData.saldo) {
        setError('Por favor completa todos los campos');
        return;
      }

      // Guardar número completo sin espacios (solo dígitos)
      const numeroLimpio = formData.numero.replace(/\s/g, '');

      // Guardar en el microservicio
      const currentUser = getAuthenticatedUser();
      if (!currentUser || !currentUser.id) {
        setError('Usuario no autenticado');
        return;
      }
      
      const tarjetaData = {
        idUsuario: parseInt(currentUser.id),
        tipo: formData.tipo,
        numero: numeroLimpio,
        titular: formData.titular,
        fechaVencimiento: formData.fechaVencimiento,
        cvv: formData.cvv,
        saldo: parseFloat(formData.saldo),
        porDefecto: formData.porDefecto
      };

      const response = await tarjetasService.guardarTarjeta(tarjetaData);
      const nuevaTarjeta = response.data;
      
      setPaymentMethods(prev => [...prev, nuevaTarjeta]);
      setShowAddForm(false);
      
      // Reset form
      setFormData({
        tipo: 'CREDITO',
        numero: '',
        titular: '',
        fechaVencimiento: '',
        cvv: '',
        saldo: '',
        porDefecto: false
      });

      alert('Tarjeta agregada exitosamente');
      
    } catch (err: any) {
      setError('Error al agregar tarjeta: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta tarjeta?')) return;
    
    try {
      await tarjetasService.eliminarTarjeta(id);
      setPaymentMethods(prev => prev.filter(method => method.id !== id));
      alert('Tarjeta eliminada exitosamente');
    } catch (err: any) {
      setError('Error al eliminar tarjeta: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      const idUsuario = 1; // Simulado
      await tarjetasService.marcarComoPredeterminada(id, idUsuario);
      setPaymentMethods(prev => 
        prev.map(method => ({
          ...method,
          porDefecto: method.id === id
        }))
      );
      alert('Tarjeta marcada como predeterminada');
    } catch (err: any) {
      setError('Error al actualizar tarjeta: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Métodos de Pago</h1>
          <p className="text-secondary-600">Gestiona tus tarjetas de crédito/débito y saldos</p>
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

        {/* Add New Card Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {showAddForm ? 'Cancelar' : 'Agregar Nueva Tarjeta'}
          </button>
        </div>

        {/* Add Card Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">Agregar Nueva Tarjeta</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Tarjeta
                  </label>
                  <select
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="CREDITO">Tarjeta de Crédito</option>
                    <option value="DEBITO">Tarjeta de Débito</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Titular
                  </label>
                  <input
                    type="text"
                    name="titular"
                    value={formData.titular}
                    onChange={handleInputChange}
                    placeholder="Juan Pérez"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Tarjeta
                </label>
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Vencimiento
                  </label>
                  <input
                    type="text"
                    name="fechaVencimiento"
                    value={formData.fechaVencimiento}
                    onChange={handleInputChange}
                    placeholder="MM/AA"
                    maxLength={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saldo Inicial ($)
                </label>
                <input
                  type="number"
                  name="saldo"
                  value={formData.saldo}
                  onChange={handleInputChange}
                  placeholder="100000.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="porDefecto"
                  checked={formData.porDefecto}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Marcar como tarjeta predeterminada
                </label>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar Tarjeta'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Payment Methods List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando métodos de pago...</p>
            </div>
          ) : paymentMethods.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-xl shadow-sm border border-secondary-200">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes tarjetas guardadas</h3>
              <p className="text-gray-600">Agrega tu primera tarjeta para comenzar a usar el sistema</p>
            </div>
          ) : (
            paymentMethods.map((method) => (
              <div key={method.id} className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {method.tipo === 'CREDITO' ? 'Tarjeta de Crédito' : 'Tarjeta de Débito'}
                      </div>
                      <div className="text-sm text-gray-600">{method.numero}</div>
                      <div className="text-sm text-gray-600">Titular: {method.titular}</div>
                      <div className="text-sm text-gray-600">Vence: {method.fechaVencimiento}</div>
                      <div className="text-sm font-medium text-green-600">Saldo: ${method.saldo.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {method.porDefecto && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                        Predeterminada
                      </span>
                    )}
                    
                    {!method.porDefecto && (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Marcar como predeterminada
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(method.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/perfil')}
            className="btn-secondary"
          >
            Volver al Perfil
          </button>
        </div>
      </main>
    </div>
  );
};

export default PaymentMethodsPage;
