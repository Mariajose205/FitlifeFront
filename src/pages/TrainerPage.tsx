import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Dumbbell, Users, Calendar, Clock, TrendingUp, Award, Plus, Edit, Trash2 } from 'lucide-react';

export const TrainerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Mock trainer data
  const trainerData = {
    name: 'Juan Entrenador',
    email: 'trainer@fitlife.cl',
    specialties: ['Entrenamiento Funcional', 'Spinning', 'Boxing', 'HIIT'],
    experience: '5 años',
    rating: 4.8,
    totalClasses: 156,
    totalStudents: 89,
    thisMonthClasses: 24,
  };

  const upcomingClasses = [
    {
      id: 1,
      name: 'Spinning Intensivo',
      date: '2024-01-15',
      time: '06:00 PM',
      location: 'Sala de Ciclismo',
      enrolledStudents: 12,
      maxStudents: 20,
      status: 'confirmed'
    },
    {
      id: 2,
      name: 'Spinning Intensivo',
      date: '2024-01-15',
      time: '10:00 AM',
      location: 'Sala de Ciclismo',
      enrolledStudents: 18,
      maxStudents: 25,
      status: 'confirmed'
    },
    {
      id: 3,
      name: 'Entrenamiento Funcional',
      date: '2024-01-16',
      time: '06:00 PM',
      location: 'Área de Pesas',
      enrolledStudents: 8,
      maxStudents: 15,
      status: 'pending'
    },
  ];

  const myStudents = [
    {
      id: 1,
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      membershipType: 'Premium',
      joinedDate: '2023-01-15',
      lastClass: '2024-01-10',
      progress: 85,
      avatar: 'https://images.unsplash.com/photo-1494790108757-9c5472d8d9a?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@email.com',
      membershipType: 'Basic',
      joinedDate: '2023-03-20',
      lastClass: '2024-01-08',
      progress: 72,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2?w=40&h=40&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Ana Martínez',
      email: 'ana.martinez@email.com',
      membershipType: 'Premium',
      joinedDate: '2023-02-10',
      lastClass: '2024-01-12',
      progress: 93,
      avatar: 'https://images.unsplash.com/photo-1438761681033-64721a68f0d7?w=40&h=40&fit=crop&crop=face'
    },
  ];

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'classes', name: 'Mis Clases', icon: Calendar },
    { id: 'students', name: 'Mis Estudiantes', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Trainer Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center">
              <Dumbbell className="w-12 h-12 text-white" />
            </div>
            
            {/* Trainer Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-secondary-900">{trainerData.name}</h1>
              <p className="text-secondary-600">{trainerData.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  Entrenador Certificado
                </span>
                <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm">
                  {trainerData.experience} de experiencia
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex space-x-2">
              <button className="btn-secondary">
                <Edit className="w-4 h-4 mr-2" />
                Editar Perfil
              </button>
              <button className="btn-secondary text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4 mr-2" />
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
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-secondary-900">Panel del Entrenador</h2>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-primary-50 p-4 rounded-lg text-center">
                  <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary-600">{trainerData.totalClasses}</div>
                  <div className="text-sm text-primary-700">Clases Totales</div>
                </div>
                <div className="bg-secondary-50 p-4 rounded-lg text-center">
                  <Users className="w-8 h-8 text-secondary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-secondary-600">{trainerData.totalStudents}</div>
                  <div className="text-sm text-secondary-700">Estudiantes Totales</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{trainerData.thisMonthClasses}</div>
                  <div className="text-sm text-green-700">Clases este Mes</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <Award className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">{trainerData.rating}</div>
                  <div className="text-sm text-yellow-700">Calificación Promedio</div>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Especialidades</h3>
                <div className="flex flex-wrap gap-2">
                  {trainerData.specialties.map((specialty, index) => (
                    <span key={index} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'classes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Mis Clases Programadas</h2>
                <button className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Clase
                </button>
              </div>
              
              <div className="space-y-4">
                {upcomingClasses.map((classItem) => (
                  <div key={classItem.id} className="border border-secondary-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-secondary-900">{classItem.name}</h3>
                        <div className="flex flex-wrap gap-4 mt-1 text-sm text-secondary-600">
                          <span>{classItem.date}</span>
                          <span>{classItem.time}</span>
                          <span>{classItem.location}</span>
                          <span className={`font-medium ${
                            classItem.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {classItem.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 sm:mt-0">
                        <div className="text-sm text-secondary-600">
                          {classItem.enrolledStudents}/{classItem.maxStudents} estudiantes
                        </div>
                        <button className="btn-secondary text-sm px-4 py-2">
                          Gestionar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-secondary-900">Mis Estudiantes</h2>
                <div className="text-sm text-secondary-600">
                  Total: {myStudents.length} estudiantes activos
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myStudents.map((student) => (
                  <div key={student.id} className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-secondary-900">{student.name}</h3>
                        <p className="text-sm text-secondary-600">{student.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-secondary-500">Membresía</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          student.membershipType === 'Premium' 
                            ? 'bg-primary-100 text-primary-700' 
                            : 'bg-secondary-100 text-secondary-700'
                        }`}>
                          {student.membershipType}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-secondary-500">Progreso</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-secondary-200 rounded-full h-2">
                            <div 
                              className="h-2 bg-primary-600 rounded-full"
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-secondary-700">{student.progress}%</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-secondary-500">Última clase</span>
                        <span className="text-sm text-secondary-700">{student.lastClass}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-secondary-200">
                      <button className="w-full btn-secondary text-sm">
                        Ver Detalles Completos
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
