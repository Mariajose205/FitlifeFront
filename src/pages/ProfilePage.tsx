import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Dumbbell, User, Users, Mail, Phone, MapPin, Calendar, Award, Activity, Clock, CreditCard, Settings, LogOut, Shield } from 'lucide-react';
import { useRole } from '../contexts/RoleContext';

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { currentUser, switchRole, isAdmin, isTrainer } = useRole();
  
  // Mock user data - now using currentUser from context
  const userData = {
    name: currentUser.name,
    email: currentUser.email,
    phone: currentUser.phone || '+56 9 1234 5678',
    birthDate: '1990-05-15',
    address: currentUser.location || 'Av. Providencia 1234, Santiago, Chile',
    memberSince: '2023-01-15',
    membershipType: 'Premium',
    nextPayment: '2024-01-15',
  };

  const recentActivities = [
    { id: 1, class: 'Spinning', date: '2024-01-10', time: '06:00 PM', instructor: 'Carlos Rodríguez' },
    { id: 2, class: 'Entrenamiento Funcional', date: '2024-01-08', time: '10:00 AM', instructor: 'Pedro Sánchez' },
    { id: 3, class: 'Boxing', date: '2024-01-05', time: '07:00 PM', instructor: 'Miguel Ángel' },
  ];

  const upcomingClasses = [
    { id: 1, class: 'Spinning', date: '2024-01-15', time: '06:00 PM', instructor: 'Carlos Rodríguez', spots: 8 },
    { id: 2, class: 'Boxing', date: '2024-01-16', time: '07:00 PM', instructor: 'Miguel Ángel', spots: 3 },
  ];

  const stats = {
    totalClasses: 45,
    thisMonth: 12,
    favoriteClass: 'Spinning',
    streak: 7,
  };

  const baseTabs = [
    { id: 'overview', name: 'Resumen', icon: User },
    { id: 'activities', name: 'Actividades', icon: Activity },
    { id: 'schedule', name: 'Horario', icon: Calendar },
    { id: 'payments', name: 'Pagos', icon: CreditCard },
    { id: 'settings', name: 'Configuración', icon: Settings },
  ];

  const adminTabs = [
    ...baseTabs,
    { id: 'admin-panel', name: 'Panel Admin', icon: Shield },
  ];

  const trainerTabs = [
    ...baseTabs,
    { id: 'trainer-panel', name: 'Panel Entrenador', icon: Dumbbell },
  ];

  const tabs = isAdmin ? adminTabs : isTrainer ? trainerTabs : baseTabs;

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
              isAdmin ? 'bg-red-600' : isTrainer ? 'bg-blue-600' : 'bg-primary-600'
            }`}>
              {isAdmin ? <Shield className="w-12 h-12 text-white" /> : <User className="w-12 h-12 text-white" />}
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-secondary-900">{userData.name}</h1>
              <p className="text-secondary-600">{userData.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isAdmin ? 'bg-red-100 text-red-700' : 
                  isTrainer ? 'bg-blue-100 text-blue-700' : 
                  'bg-primary-100 text-primary-700'
                }`}>
                  {isAdmin ? 'Administrador' : isTrainer ? 'Entrenador' : userData.membershipType}
                </span>
                <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">
                  Miembro desde {new Date(userData.memberSince).getFullYear()}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <button className="btn-secondary">
                <Settings className="w-4 h-4 mr-2" />
                Editar Perfil
              </button>
              <button 
                onClick={() => {
                  if (isAdmin) {
                    switchRole('TRAINER');
                  } else if (isTrainer) {
                    switchRole('USER');
                  } else {
                    switchRole('ADMIN');
                  }
                }}
                className="btn-secondary text-purple-600 hover:text-purple-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                Cambiar Rol
              </button>
              <button className="btn-secondary text-red-600 hover:text-red-700">
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
                  <Dumbbell className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
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

          {activeTab === 'admin-panel' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-secondary-900">Panel de Administración</h2>
              
              {/* Admin Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <Users className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">1247</div>
                  <div className="text-sm text-red-700">Usuarios Totales</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Dumbbell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">45</div>
                  <div className="text-sm text-blue-700">Entrenadores</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">3421</div>
                  <div className="text-sm text-green-700">Clases Totales</div>
                </div>
              </div>

              {/* User Management */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Gestión de Usuarios y Entrenadores</h3>
                <div className="space-y-4">
                  <div className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-secondary-900">Usuarios Registrados</h4>
                      <button className="btn-primary text-sm">Ver Todos</button>
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: 'María González', email: 'maria.gonzalez@email.com', type: 'Usuario', status: 'Activo' },
                        { name: 'Carlos Rodríguez', email: 'carlos.rodriguez@email.com', type: 'Usuario', status: 'Activo' },
                      ].map((user, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-secondary-50 rounded">
                          <div>
                            <div className="font-medium text-secondary-900">{user.name}</div>
                            <div className="text-sm text-secondary-600">{user.email}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">{user.status}</span>
                            <button className="text-primary-600 hover:text-primary-700 text-sm">Editar</button>
                            <button className="text-red-600 hover:text-red-700 text-sm">Suspender</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-secondary-900">Entrenadores</h4>
                      <button className="btn-primary text-sm">Gestionar</button>
                    </div>
                    <div className="space-y-2">
                      {[
                        { name: 'Juan Entrenador', email: 'trainer@fitlife.cl', phone: '+56 9 8765 4321', schedule: 'Lun-Vie 6:00-22:00' },
                        { name: 'Ana Martínez', email: 'ana.martinez@fitlife.cl', phone: '+56 9 1234 5678', schedule: 'Lun-Vie 8:00-20:00' },
                      ].map((trainer, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-blue-50 rounded">
                          <div>
                            <div className="font-medium text-secondary-900">{trainer.name}</div>
                            <div className="text-sm text-secondary-600">{trainer.email}</div>
                            <div className="text-xs text-secondary-500">{trainer.phone} • {trainer.schedule}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="text-primary-600 hover:text-primary-700 text-sm">Editar</button>
                            <button className="text-red-600 hover:text-red-700 text-sm">Desvincular</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'trainer-panel' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-secondary-900">Panel de Entrenador</h2>
              
              {/* Trainer Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">156</div>
                  <div className="text-sm text-blue-700">Clases Totales</div>
                </div>
                <div className="bg-primary-50 p-4 rounded-lg text-center">
                  <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary-600">89</div>
                  <div className="text-sm text-primary-700">Estudiantes</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">24</div>
                  <div className="text-sm text-green-700">Clases este Mes</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">4.8</div>
                  <div className="text-sm text-yellow-700">Calificación</div>
                </div>
              </div>

              {/* Schedule and Capacity */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Horarios y Cupos Disponibles</h3>
                <div className="space-y-4">
                  {[
                    { 
                      class: 'Spinning Intensivo', 
                      date: '2024-01-15', 
                      time: '06:00 PM', 
                      location: 'Sala de Ciclismo', 
                      enrolled: 18, 
                      maxStudents: 25,
                      trainer: 'Juan Entrenador'
                    },
                    { 
                      class: 'Spinning Intensivo', 
                      date: '2024-01-15', 
                      time: '10:00 AM', 
                      location: 'Sala de Ciclismo', 
                      enrolled: 18, 
                      maxStudents: 25,
                      trainer: 'Juan Entrenador'
                    },
                    { 
                      class: 'Entrenamiento Funcional', 
                      date: '2024-01-16', 
                      time: '06:00 PM', 
                      location: 'Área de Pesas', 
                      enrolled: 8, 
                      maxStudents: 15,
                      trainer: 'Ana Martínez'
                    },
                  ].map((schedule, index) => (
                    <div key={index} className="border border-secondary-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-secondary-900">{schedule.class}</h4>
                          <div className="text-sm text-secondary-600 mt-1">
                            {schedule.date} • {schedule.time} • {schedule.location}
                          </div>
                          <div className="text-sm text-primary-600 font-medium mt-1">
                            Entrenador: {schedule.trainer}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-lg font-bold ${
                            schedule.enrolled >= schedule.maxStudents ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {schedule.enrolled}/{schedule.maxStudents}
                          </div>
                          <div className="text-xs text-secondary-600">cupos</div>
                        </div>
                      </div>
                      <div className="w-full bg-secondary-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            schedule.enrolled >= schedule.maxStudents ? 'bg-red-600' : 'bg-primary-600'
                          }`}
                          style={{ width: `${(schedule.enrolled / schedule.maxStudents) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
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
