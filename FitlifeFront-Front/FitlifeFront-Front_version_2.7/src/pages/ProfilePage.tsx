import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { getAuthenticatedUser } from '../utils/userTypeDetection';
import { reservasService, pagosService } from '../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Activity, 
  Clock, 
  CreditCard, 
  Settings, 
  LogOut,
  AlertTriangle,
  Camera,
  Upload,
  X,
  History,
  DollarSign
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('/src/assets/default-avatar.png');
  
  // Estados para reservas y pagos
  const [reservas, setReservas] = useState<any[]>([]);
  const [pagos, setPagos] = useState<any[]>([]);
  const [loadingReservas, setLoadingReservas] = useState(false);
  const [loadingPagos, setLoadingPagos] = useState(false);

  useEffect(() => {
    const user = getAuthenticatedUser();
    setCurrentUser(user);
    
    // Cargar reservas y pagos si hay usuario autenticado
    if (user) {
      loadReservas(user.id);
      loadPagos(user.id);
    }
  }, []);

  const loadReservas = async (userId: string) => {
    try {
      setLoadingReservas(true);
      const response = await reservasService.obtenerReservasPorUsuario(parseInt(userId));
      setReservas(response.data);
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    } finally {
      setLoadingReservas(false);
    }
  };

  const loadPagos = async (userId: string) => {
    try {
      setLoadingPagos(true);
      const response = await pagosService.obtenerPagosPorUsuario(parseInt(userId));
      setPagos(response.data);
    } catch (error) {
      console.error('Error al cargar pagos:', error);
    } finally {
      setLoadingPagos(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handlePhotoEdit = () => {
    setIsEditingPhoto(true);
  };

  const handlePhotoSave = () => {
    setProfilePhoto(profilePhoto);
    setIsEditingPhoto(false);
    alert('Foto de perfil actualizada');
  };

  const handlePhotoCancel = () => {
    setIsEditingPhoto(false);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setProfilePhoto(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmLogout = () => {
    // Limpiar cualquier estado de autenticación local
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('authenticatedUser');
    
    // Redirigir al login
    navigate('/login');
  };
  
  // User data based on current authenticated user
  const getUserData = () => {
    if (!currentUser) {
      // Default fallback
      return {
        name: 'Usuario',
        email: 'usuario@ejemplo.com',
        phone: '+56 9 0000 0000',
        birthDate: '1990-01-01',
        address: 'Dirección no especificada',
        memberSince: '2024-01-01',
        membershipType: 'Básico',
        nextPayment: '2024-12-01',
      };
    }

    // Use real user data from registration
    return {
      name: currentUser.name || 'Usuario',
      email: currentUser.email || 'usuario@ejemplo.com',
      phone: currentUser.phone || '+56 9 0000 0000',
      birthDate: currentUser.birthDate || '1990-01-01',
      address: currentUser.address || 'Dirección no especificada',
      memberSince: currentUser.memberSince || '2024-01-01',
      membershipType: currentUser.membershipType || 'Básico',
      nextPayment: '2024-12-01',
    };
  };

  const userData = getUserData();

  const stats = {
    totalClasses: 45,
    thisMonth: 12,
    favoriteClass: 'Entrenamiento Funcional',
    streak: 7,
  };

  const tabs = [
    { id: 'overview', name: 'Resumen', icon: User },
    { id: 'activities', name: 'Actividades', icon: Activity },
    { id: 'schedule', name: 'Horario', icon: Calendar },
    { id: 'payments', name: 'Pagos', icon: CreditCard },
    { id: 'reservations', name: 'Historial de Reservas', icon: History },
    { id: 'settings', name: 'Configuración', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
            </div>

            {/* Modal Content */}
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                ¿Estás seguro de cerrar sesión?
              </h3>
              <p className="text-secondary-600">
                Perderás el acceso a tu cuenta y deberás iniciar sesión nuevamente para continuar.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Edit Modal */}
      {isEditingPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-secondary-900">
                Editar Foto de Perfil
              </h3>
              <button 
                onClick={handlePhotoCancel}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="text-center mb-6">
              <div className="mb-4">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto overflow-hidden">
                  {profilePhoto.startsWith('data:') ? (
                    <img 
                      src={profilePhoto} 
                      alt="Foto de perfil" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
              </div>
              
              <label className="btn-primary flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                Subir Foto
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex space-x-3">
              <button
                onClick={handlePhotoCancel}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handlePhotoSave}
                className="flex-1 btn-primary"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center overflow-hidden">
                {profilePhoto.startsWith('data:') ? (
                  <img 
                    src={profilePhoto} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              
              {/* Edit Photo Button */}
              <button 
                onClick={handlePhotoEdit}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors duration-200"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-secondary-900">{userData.name}</h1>
              <p className="text-secondary-600">{userData.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {userData.membershipType}
                </span>
                <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">
                  Miembro desde {new Date(userData.memberSince).getFullYear()}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              {/* Admin Dashboard Button - Only show for admin users */}
              {currentUser?.role === 'admin' && (
                <button 
                  onClick={() => navigate('/admin-dashboard')}
                  className="btn-primary"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Panel de Administración
                </button>
              )}
              
              {/* Trainer Dashboard Button - Only show for trainer users */}
              {currentUser?.role === 'trainer' && (
                <button 
                  onClick={() => navigate('/trainer-dashboard')}
                  className="btn-primary"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Panel Entrenador
                </button>
              )}
              
              <button className="btn-secondary">
                <Settings className="w-4 h-4 mr-2" />
                Editar Perfil
              </button>
              <button 
                onClick={handleLogout}
                className="btn-secondary text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-2 mb-6">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white'
                      : 'text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-secondary-900">Resumen de tu Perfil</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-primary-50 p-4 rounded-lg text-center">
                  <Award className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary-600">{stats.totalClasses}</div>
                  <div className="text-sm text-primary-700">Clases Totales</div>
                </div>
                <div className="bg-secondary-50 p-4 rounded-lg text-center">
                  <Activity className="w-8 h-8 text-secondary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-secondary-600">{stats.thisMonth}</div>
                  <div className="text-sm text-secondary-700">Este Mes</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{stats.streak}</div>
                  <div className="text-sm text-green-700">Días Seguidos</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <Activity className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-yellow-600">{stats.favoriteClass}</div>
                  <div className="text-sm text-yellow-700">Clase Favorita</div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Información Personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-secondary-400" />
                      <div>
                        <div className="text-sm text-secondary-500">Email</div>
                        <div className="text-secondary-900">{userData.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-secondary-400" />
                      <div>
                        <div className="text-sm text-secondary-500">Teléfono</div>
                        <div className="text-secondary-900">{userData.phone}</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-secondary-400" />
                      <div>
                        <div className="text-sm text-secondary-500">Fecha de Nacimiento</div>
                        <div className="text-secondary-900">{userData.birthDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-secondary-400" />
                      <div>
                        <div className="text-sm text-secondary-500">Dirección</div>
                        <div className="text-secondary-900">{userData.address}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-secondary-900">Actividades Recientes</h2>
              
              {loadingReservas ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando actividades...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservas.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No tienes actividades aún</p>
                    </div>
                  ) : (
                    reservas.map((reserva) => (
                      <div key={reserva.id} className="border border-secondary-200 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-secondary-900">Reserva #{reserva.id}</h3>
                            <div className="flex flex-wrap gap-4 mt-1 text-sm text-secondary-600">
                              <span>{new Date(reserva.fechaReserva).toLocaleDateString()}</span>
                              <span>Estado: {reserva.estado}</span>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              reserva.estado === 'COMPLETADA' ? 'bg-green-100 text-green-800' :
                              reserva.estado === 'ACTIVA' ? 'bg-blue-100 text-blue-800' :
                              reserva.estado === 'CANCELADA' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {reserva.estado}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-secondary-900">Próximas Clases</h2>
              
              {loadingReservas ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando horarios...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservas.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No tienes clases programadas</p>
                    </div>
                  ) : (
                    reservas.filter(r => r.estado === 'ACTIVA' || r.estado === 'PENDIENTE').map((reserva) => (
                      <div key={reserva.id} className="border border-secondary-200 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-secondary-900">Reserva #{reserva.id}</h3>
                            <div className="flex flex-wrap gap-4 mt-1 text-sm text-secondary-600">
                              <span>{new Date(reserva.fechaClase).toLocaleDateString()}</span>
                              <span>{new Date(reserva.fechaClase).toLocaleTimeString()}</span>
                              <span>Estado: {reserva.estado}</span>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              reserva.estado === 'ACTIVA' ? 'bg-green-100 text-green-800' :
                              reserva.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {reserva.estado}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-secondary-900">Información de Pagos</h2>
              
              {loadingPagos ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando pagos...</p>
                </div>
              ) : (
                <>
                  <div className="bg-secondary-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-secondary-500">Tipo de Membresía</div>
                        <div className="text-lg font-semibold text-secondary-900">{userData.membershipType}</div>
                      </div>
                      <div>
                        <div className="text-sm text-secondary-500">Total Pagado</div>
                        <div className="text-lg font-semibold text-secondary-900">
                          ${pagos.reduce((sum, p) => sum + (p.monto || 0), 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lista de pagos */}
                  <div className="bg-white rounded-xl shadow-sm border border-secondary-200">
                    <div className="p-4 border-b border-secondary-200">
                      <h3 className="text-lg font-semibold text-secondary-900">Historial de Pagos</h3>
                    </div>
                    <div className="divide-y divide-secondary-200 max-h-96 overflow-y-auto">
                      {pagos.length === 0 ? (
                        <div className="p-8 text-center">
                          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No tienes pagos aún</p>
                        </div>
                      ) : (
                        pagos.map((pago) => (
                          <div key={pago.id} className="p-4 hover:bg-secondary-50">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="font-medium text-secondary-900">Pago #{pago.id}</div>
                                <div className="text-sm text-secondary-600">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="w-3 h-3" />
                                    <span>{new Date(pago.fechaPago).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <DollarSign className="w-3 h-3" />
                                    <span>Monto: ${pago.monto?.toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <CreditCard className="w-3 h-3" />
                                    <span>Método: {pago.metodoPago}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  pago.estado === 'COMPLETADO' ? 'bg-green-100 text-green-800' :
                                  pago.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {pago.estado}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
              
              <button 
                onClick={() => navigate('/metodos-pago')}
                className="btn-primary"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Gestionar Método de Pago
              </button>
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-secondary-900 mb-6">Historial de Reservas</h2>
              
              {loadingReservas ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Cargando reservas...</p>
                </div>
              ) : (
                <>
                  {/* Resumen de reservas */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-4 rounded-lg border border-secondary-200">
                      <div className="text-sm text-secondary-500 mb-2">Total Reservas</div>
                      <div className="text-2xl font-bold text-primary-600">{reservas.length}</div>
                      <div className="text-sm text-secondary-600">Total</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-secondary-200">
                      <div className="text-sm text-secondary-500 mb-2">Completadas</div>
                      <div className="text-2xl font-bold text-green-600">{reservas.filter(r => r.estado === 'COMPLETADA').length}</div>
                      <div className="text-sm text-secondary-600">Total</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-secondary-200">
                      <div className="text-sm text-secondary-500 mb-2">Activas</div>
                      <div className="text-2xl font-bold text-blue-600">{reservas.filter(r => r.estado === 'ACTIVA').length}</div>
                      <div className="text-sm text-secondary-600">Total</div>
                    </div>
                  </div>

                  {/* Lista detallada de reservas */}
                  <div className="bg-white rounded-xl shadow-sm border border-secondary-200">
                    <div className="p-4 border-b border-secondary-200">
                      <h3 className="text-lg font-semibold text-secondary-900">Todas tus Reservas</h3>
                    </div>
                    <div className="divide-y divide-secondary-200 max-h-96 overflow-y-auto">
                      {reservas.length === 0 ? (
                        <div className="p-8 text-center">
                          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No tienes reservas aún</p>
                        </div>
                      ) : (
                        reservas.map((reserva) => (
                          <div key={reserva.id} className="p-4 hover:bg-secondary-50">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-2 h-2 rounded-full ${
                                    reserva.estado === 'COMPLETADA' ? 'bg-green-500' :
                                    reserva.estado === 'ACTIVA' ? 'bg-blue-500' :
                                    reserva.estado === 'CANCELADA' ? 'bg-red-500' :
                                    'bg-yellow-500'
                                  }`}></div>
                                  <div>
                                    <div className="font-medium text-secondary-900">Reserva #{reserva.id}</div>
                                    <div className="text-sm text-secondary-600">
                                      <div className="flex items-center space-x-2">
                                        <Calendar className="w-3 h-3" />
                                        <span>{new Date(reserva.fechaReserva).toLocaleDateString()}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-sm text-secondary-500 mt-1">
                                  <Clock className="w-3 h-3 inline mr-1" />
                                  {reserva.estado}
                                </div>
                              </div>
                              <div className="ml-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  reserva.estado === 'COMPLETADA' ? 'bg-green-100 text-green-800' :
                                  reserva.estado === 'ACTIVA' ? 'bg-blue-100 text-blue-800' :
                                  reserva.estado === 'CANCELADA' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {reserva.estado}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Pagos asociados a reservas */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Pagos Realizados</h3>
                {loadingPagos ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando pagos...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <DollarSign className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Total Pagado</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        ${pagos.reduce((sum, p) => sum + (p.monto || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-green-600">{pagos.length} pagos realizados</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Último Pago</span>
                      </div>
                      <div className="text-lg font-semibold text-blue-600">
                        ${pagos.length > 0 ? pagos[pagos.length - 1]?.monto?.toLocaleString() : '$0'}
                      </div>
                      <div className="text-sm text-blue-600">
                        {pagos.length > 0 ? new Date(pagos[pagos.length - 1].fechaPago).toLocaleDateString() : 'Sin pagos'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-secondary-900">Configuración de Cuenta</h2>
              
              <div className="space-y-4">
                <button className="w-full text-left p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-secondary-900">Información Personal</div>
                      <div className="text-sm text-secondary-600">Actualiza tus datos personales</div>
                    </div>
                    <Settings className="w-5 h-5 text-secondary-400" />
                  </div>
                </button>
                
                <button className="w-full text-left p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-secondary-900">Notificaciones</div>
                      <div className="text-sm text-secondary-600">Configura tus preferencias</div>
                    </div>
                    <Settings className="w-5 h-5 text-secondary-400" />
                  </div>
                </button>
                
                <button className="w-full text-left p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-secondary-900">Privacidad y Seguridad</div>
                      <div className="text-sm text-secondary-600">Protección de datos</div>
                    </div>
                    <Settings className="w-5 h-5 text-secondary-400" />
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
