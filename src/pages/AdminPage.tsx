import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Dumbbell, Users, TrendingUp, Calendar, DollarSign, Settings, LogOut, Shield, Activity, Eye, EyeOff } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPassword, setShowPassword] = useState(false);
  
  // Mock admin data
  const adminStats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalTrainers: 45,
    totalClasses: 3421,
    monthlyRevenue: 15678900,
    newUsersThisMonth: 89,
    growthRate: 12.5,
  };

  const recentActivities = [
    { id: 1, user: 'María González', action: 'Registró nueva cuenta', time: '2026-01-15 14:30', type: 'user' },
    { id: 2, user: 'Juan Entrenador', action: 'Creó clase nueva', time: '2026-01-15 13:15', type: 'trainer' },
    { id: 3, user: 'Carlos Rodríguez', action: 'Actualizó membresía', time: '2026-01-15 12:45', type: 'user' },
    { id: 4, user: 'Ana Martínez', action: 'Canceló clase', time: '2026-01-15 11:20', type: 'user' },
    { id: 5, user: 'Pedro Sánchez', action: 'Inició sesión', time: '2026-01-15 10:30', type: 'user' },
  ];

  const systemHealth = {
    serverStatus: 'Operativo',
    databaseStatus: 'Sincronizado',
    lastBackup: '2026-01-15 03:00',
    uptime: '99.98%',
    responseTime: '142ms',
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'users', name: 'Usuarios', icon: Users },
    { id: 'classes', name: 'Clases', icon: Calendar },
    { id: 'revenue', name: 'Ingresos', icon: DollarSign },
    { id: 'system', name: 'Sistema', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Admin Header */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center">
              <Shield className="w-12 h-12 text-white" />
            </div>
            
            {/* Admin Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-secondary-900">Panel de Administración</h1>
              <p className="text-secondary-600">admin@fitlife.cl</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  Super Administrador
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Sistema Operativo
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button className="btn-secondary">
                <Settings className="w-4 h-4 mr-2" />
                Configuración
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
                      ? 'bg-red-600 text-white'
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
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-secondary-900">Resumen General</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-primary-50 p-4 rounded-lg text-center">
                  <Users className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary-600">{adminStats.totalUsers}</div>
                  <div className="text-sm text-primary-700">Usuarios Totales</div>
                  <div className="text-xs text-primary-600 mt-1">+{adminStats.newUsersThisMonth} este mes</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{adminStats.activeUsers}</div>
                  <div className="text-sm text-green-700">Usuarios Activos</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Dumbbell className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{adminStats.totalTrainers}</div>
                  <div className="text-sm text-blue-700">Entrenadores</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <Calendar className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">{adminStats.totalClasses}</div>
                  <div className="text-sm text-yellow-700">Clases Totales</div>
                </div>
              </div>

              {/* Revenue Section */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Ingresos Mensuales</h3>
                <div className="bg-secondary-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold text-secondary-900">
                        ${adminStats.monthlyRevenue.toLocaleString('es-CL')}
                      </div>
                      <div className="text-sm text-secondary-600">Ingresos totales este mes</div>
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      +{adminStats.growthRate}% vs mes anterior
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Gestión de Usuarios</h2>
                <button className="btn-primary">
                  Nuevo Usuario
                </button>
              </div>
              
              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-secondary-200 rounded-lg">
                  <thead className="bg-secondary-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200">
                    <tr className="hover:bg-secondary-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">María González</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">maria.gonzalez@email.com</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">Usuario</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Activo</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-primary-600 hover:text-primary-700 mr-2">Editar</button>
                        <button className="text-red-600 hover:text-red-700">Suspender</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-secondary-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">Juan Entrenador</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-600">trainer@fitlife.cl</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Entrenador</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Activo</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button className="text-primary-600 hover:text-primary-700 mr-2">Editar</button>
                        <button className="text-red-600 hover:text-red-700">Suspender</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'classes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Gestión de Clases</h2>
                <button className="btn-primary">
                  Nueva Clase
                </button>
              </div>
              
              {/* Classes Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Yoga Flow', instructor: 'Ana Martínez', time: '08:00 AM', location: 'Sala A', enrolled: 15, status: 'Activa' },
                  { name: 'Spinning', instructor: 'Carlos Rodríguez', time: '06:00 PM', location: 'Sala Ciclismo', enrolled: 20, status: 'Activa' },
                  { name: 'Boxing', instructor: 'Miguel Ángel', time: '07:00 PM', location: 'Ring', enrolled: 12, status: 'Pendiente' },
                ].map((classItem, index) => (
                  <div key={index} className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-secondary-900">{classItem.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        classItem.status === 'Activa' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {classItem.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-secondary-600">
                      <p><strong>Instructor:</strong> {classItem.instructor}</p>
                      <p><strong>Horario:</strong> {classItem.time}</p>
                      <p><strong>Ubicación:</strong> {classItem.location}</p>
                      <p><strong>Inscritos:</strong> {classItem.enrolled} estudiantes</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="btn-secondary text-sm">Ver Detalles</button>
                      <button className="btn-primary text-sm">Editar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-secondary-900">Reporte de Ingresos</h2>
              
              {/* Revenue Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-4">Este Mes</h3>
                  <div className="text-3xl font-bold text-green-600">
                    ${adminStats.monthlyRevenue.toLocaleString('es-CL')}
                  </div>
                  <div className="text-sm text-green-700">Ingresos totales</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Mes Anterior</h3>
                  <div className="text-3xl font-bold text-blue-600">
                    ${((adminStats.monthlyRevenue * 0.92).toLocaleString('es-CL'))}
                  </div>
                  <div className="text-sm text-blue-700">Ingresos totales</div>
                </div>
              </div>

              {/* Revenue Chart Placeholder */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Gráfico de Tendencia</h3>
                <div className="bg-secondary-100 p-8 rounded-lg text-center">
                  <DollarSign className="w-12 h-12 text-secondary-400 mx-auto mb-2" />
                  <p className="text-secondary-600">Gráfico de ingresos mensuales</p>
                  <p className="text-sm text-secondary-500">Integración con sistema de gráficos pendiente</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-secondary-900">Estado del Sistema</h2>
              
              {/* System Health */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Servidores</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-secondary-600">Estado del Servidor</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        systemHealth.serverStatus === 'Operativo' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {systemHealth.serverStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary-600">Tiempo de Actividad</span>
                      <span className="text-secondary-900 font-medium">{systemHealth.uptime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary-600">Tiempo de Respuesta</span>
                      <span className="text-secondary-900 font-medium">{systemHealth.responseTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-secondary-900 mb-4">Base de Datos</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-secondary-600">Estado de Sincronización</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        systemHealth.databaseStatus === 'Sincronizado' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {systemHealth.databaseStatus}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-secondary-600">Último Backup</span>
                      <span className="text-secondary-900 font-medium">{systemHealth.lastBackup}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Actividad Reciente</h3>
                <div className="space-y-3">
                  {recentActivities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'user' ? 'bg-blue-500' : 
                          activity.type === 'trainer' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <div className="text-sm font-medium text-secondary-900">{activity.user}</div>
                          <div className="text-xs text-secondary-600">{activity.action}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-secondary-500">{activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
