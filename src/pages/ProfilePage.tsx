import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { getAuthenticatedUser } from '../utils/userTypeDetection';
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
  X
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('/src/assets/default-avatar.png');

  useEffect(() => {
    const user = getAuthenticatedUser();
    setCurrentUser(user);
  }, []);

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

    switch (currentUser.role) {
      case 'admin':
        return {
          name: currentUser.name || 'Administrador FitLife',
          email: currentUser.email || 'admin@fitlife.cl',
          phone: '+56 9 1111 1111',
          birthDate: '1985-03-10',
          address: 'Av. Las Condes 1000, Santiago, Chile',
          memberSince: currentUser.memberSince || '2023-01-01',
          membershipType: 'Administrador',
          nextPayment: 'N/A',
        };
      case 'trainer':
        return {
          name: currentUser.name || 'Entrenador',
          email: currentUser.email || 'trainer@fitlife.cl',
          phone: '+56 9 2222 2222',
          birthDate: '1990-07-15',
          address: 'Av. Providencia 2000, Santiago, Chile',
          memberSince: currentUser.memberSince || '2023-01-15',
          membershipType: 'Entrenador',
          nextPayment: 'N/A',
        };
      default:
        return {
          name: currentUser.name || 'Usuario Normal',
          email: currentUser.email || 'usuario@gmail.com',
          phone: '+56 9 3333 3333',
          birthDate: '1992-05-20',
          address: 'Av. Vitacura 3000, Santiago, Chile',
          memberSince: currentUser.memberSince || '2024-01-01',
          membershipType: currentUser.membershipType || 'Básico',
          nextPayment: '2024-12-01',
        };
    }
  };

  const userData = getUserData();

  const recentActivities = [
    { id: 1, class: 'Entrenamiento Funcional', date: '2024-01-10', time: '08:00 AM', instructor: 'Ana Martínez' },
    { id: 2, class: 'Spinning', date: '2024-01-08', time: '06:00 PM', instructor: 'Carlos Rodríguez' },
    { id: 3, class: 'Entrenamiento Funcional', date: '2024-01-05', time: '10:00 AM', instructor: 'Pedro Sánchez' },
  ];

  const upcomingClasses = [
    { id: 1, class: 'Entrenamiento Funcional', date: '2024-01-15', time: '08:00 AM', instructor: 'Ana Martínez', spots: 5 },
    { id: 2, class: 'Boxing', date: '2024-01-16', time: '07:00 PM', instructor: 'Miguel Ángel', spots: 3 },
  ];

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
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-secondary-900">{activity.class}</h3>
                        <div className="flex flex-wrap gap-4 mt-1 text-sm text-secondary-600">
                          <span>{activity.date}</span>
                          <span>{activity.time}</span>
                          <span>Instructor: {activity.instructor}</span>
                        </div>
                      </div>
                      <button className="btn-primary text-sm px-4 py-2 mt-2 sm:mt-0">
                        Reservar Nuevamente
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-secondary-900">Próximas Clases</h2>
              
              <div className="space-y-4">
                {upcomingClasses.map((classItem) => (
                  <div key={classItem.id} className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-secondary-900">{classItem.class}</h3>
                        <div className="flex flex-wrap gap-4 mt-1 text-sm text-secondary-600">
                          <span>{classItem.date}</span>
                          <span>{classItem.time}</span>
                          <span>Instructor: {classItem.instructor}</span>
                          <span className="text-primary-600 font-medium">{classItem.spots} cupos disponibles</span>
                        </div>
                      </div>
                      <button className="btn-secondary text-sm px-4 py-2 mt-2 sm:mt-0">
                        Cancelar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-secondary-900">Información de Pagos</h2>
              
              <div className="bg-secondary-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-secondary-500">Tipo de Membresía</div>
                    <div className="text-lg font-semibold text-secondary-900">{userData.membershipType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-secondary-500">Próximo Pago</div>
                    <div className="text-lg font-semibold text-secondary-900">{userData.nextPayment}</div>
                  </div>
                </div>
              </div>
              
              <button className="btn-primary">
                <CreditCard className="w-4 h-4 mr-2" />
                Gestionar Método de Pago
              </button>
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
