import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { getAuthenticatedUser, logoutUser } from '../utils/userTypeDetection';
// import { locationsService, reservasService } from '../services/api';
import { 
  Calendar, 
  Users, 
  Clock, 
  Plus,
  Eye,
  Edit,
  Activity,
  TrendingUp,
  Settings,
  LogOut,
  X,
  Image
} from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  membershipType: string;
  progress: number;
  lastClass: string;
}

interface ClassSchedule {
  id: string;
  name: string;
  instructor: string;
  gym: string;
  date: string;
  time: string;
  duration: string;
  price: number;
  image: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  enrolled: number;
  maxSpots: number;
  description: string;
}

export const TrainerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'classes' | 'students' | 'profile'>('dashboard');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showNewClassModal, setShowNewClassModal] = useState(false);
  const [classes, setClasses] = useState<ClassSchedule[]>([]);
  const [newClass, setNewClass] = useState<Partial<ClassSchedule>>({
    name: '',
    instructor: '',
    gym: '',
    date: '',
    time: '',
    duration: '',
    price: 0,
    image: '',
    level: 'beginner',
    enrolled: 0,
    maxSpots: 20,
    description: ''
  });
  // const [locations, setLocations] = useState<any[]>([]);
  // const [reservas, setReservas] = useState<any[]>([]);
  // const [loading, setLoading] = useState(true);

  // Get current user
  useEffect(() => {
    const user = getAuthenticatedUser();
    setCurrentUser(user);
  }, []);

  // Cargar clases desde localStorage
  useEffect(() => {
    const savedClasses = localStorage.getItem('trainerClasses');
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    } else {
      // Mock data inicial
      const initialClasses: ClassSchedule[] = [
        {
          id: '1',
          name: 'Entrenamiento Funcional',
          instructor: 'Juan Entrenador',
          gym: 'FitLife Vitacura',
          date: '2024-05-06',
          time: '08:00',
          duration: '45 min',
          price: 15000,
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
          level: 'intermediate',
          enrolled: 15,
          maxSpots: 20,
          description: 'Entrenamiento funcional que trabaja todos los grupos musculares.'
        },
        {
          id: '2',
          name: 'Musculación',
          instructor: 'Juan Entrenador',
          gym: 'FitLife Las Condes',
          date: '2024-05-06',
          time: '10:00',
          duration: '60 min',
          price: 12000,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          level: 'advanced',
          enrolled: 18,
          maxSpots: 20,
          description: 'Sesión de musculación con equipamiento completo.'
        },
        {
          id: '3',
          name: 'Spinning',
          instructor: 'Juan Entrenador',
          gym: 'FitLife Providencia',
          date: '2024-05-06',
          time: '18:00',
          duration: '50 min',
          price: 10000,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
          level: 'beginner',
          enrolled: 12,
          maxSpots: 15,
          description: 'Clase de spinning de alta intensidad.'
        }
      ];
      setClasses(initialClasses);
      localStorage.setItem('trainerClasses', JSON.stringify(initialClasses));
    }
  }, []);

  // Cargar datos de microservicios
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // setLoading(true);
      
      // Cargar locations - API deshabilitada para modo local
      // const locationsResponse = await locationsService.obtenerTodasLasLocations();
      // setLocations(locationsResponse.data);
      
      // Cargar reservas (simuladas - necesitaríamos endpoint real)
      // const reservasResponse = await reservasService.obtenerReservasPorTrainer(currentUser?.id);
      // setReservas(reservasResponse.data);
      
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      // setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleEditProfile = () => {
    alert('Editar perfil del entrenador');
  };

  const handleViewStudent = (studentId: string) => {
    alert(`Ver detalles del estudiante ID: ${studentId}`);
  };

  const handleViewClass = (classId: string) => {
    alert(`Ver detalles de la clase ID: ${classId}`);
  };

  const handleAddClass = () => {
    setShowNewClassModal(true);
  };

  // Mock data
  const stats = {
    totalClasses: 24,
    classesThisWeek: 8,
    totalStudents: 156,
    averageAttendance: 85,
    rating: 4.8
  };

  const students: Student[] = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan.perez@gmail.com',
      membershipType: 'Premium',
      progress: 75,
      lastClass: '2024-05-04'
    },
    {
      id: '2',
      name: 'María González',
      email: 'maria.gonzalez@gmail.com',
      membershipType: 'Básico',
      progress: 60,
      lastClass: '2024-05-03'
    },
    {
      id: '3',
      name: 'Ana Martínez',
      email: 'ana.martinez@gmail.com',
      membershipType: 'Premium',
      progress: 90,
      lastClass: '2024-05-05'
    },
    {
      id: '4',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@gmail.com',
      membershipType: 'Básico',
      progress: 45,
      lastClass: '2024-05-02'
    }
  ];

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Clases Totales</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalClasses}</p>
            <p className="text-sm text-blue-600">Este mes</p>
          </div>
          <Calendar className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Clases Semana</p>
            <p className="text-2xl font-bold text-gray-900">{stats.classesThisWeek}</p>
            <p className="text-sm text-green-600">Activas</p>
          </div>
          <Clock className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Alumnos</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            <p className="text-sm text-purple-600">Inscritos</p>
          </div>
          <Users className="h-8 w-8 text-purple-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Asistencia</p>
            <p className="text-2xl font-bold text-gray-900">{stats.averageAttendance}%</p>
            <p className="text-sm text-yellow-600">Promedio</p>
          </div>
          <TrendingUp className="h-8 w-8 text-yellow-600" />
        </div>
      </div>
    </div>
  );

  const renderClasses = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Mis Clases</h3>
          <button onClick={handleAddClass} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Clase
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clase
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ocupación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((classItem) => (
              <tr key={classItem.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{classItem.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {classItem.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {classItem.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(classItem.enrolled / classItem.maxSpots) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900">
                      {classItem.enrolled}/{classItem.maxSpots}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewClass(classItem.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Mis Estudiantes</h3>
        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div key={student.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{student.name}</h4>
                <p className="text-sm text-gray-600">{student.email}</p>
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                student.membershipType === 'Premium' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {student.membershipType}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-gray-600">Progreso</span>
                <span className="text-sm font-medium text-gray-900">{student.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${student.progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Última Clase</span>
                <span className="text-sm font-medium text-gray-900">{student.lastClass}</span>
              </div>

              <button 
                onClick={() => handleViewStudent(student.id)}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Ver Detalles Completos
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Entrenador</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
              <input 
                type="text" 
                defaultValue="Juan Entrenador" 
                className="input-field w-full" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                defaultValue="trainer@fitlife.cl" 
                className="input-field w-full" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
              <input 
                type="tel" 
                defaultValue="+56 9 1234 5678" 
                className="input-field w-full" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
              <input 
                type="text" 
                defaultValue="Musculación y Funcional" 
                className="input-field w-full" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experiencia</label>
              <input 
                type="text" 
                defaultValue="5 años" 
                className="input-field w-full" 
              />
            </div>
            <button 
              onClick={handleEditProfile}
              className="w-full btn-primary"
            >
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button 
              onClick={handleEditProfile}
              className="w-full btn-secondary flex items-center justify-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Editar Perfil
            </button>
            <button 
              onClick={handleLogout}
              className="w-full btn-secondary flex items-center justify-center gap-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total de Clases</span>
              <span className="text-sm font-medium text-gray-900">{stats.totalClasses}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total de Alumnos</span>
              <span className="text-sm font-medium text-gray-900">{stats.totalStudents}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Rating Promedio</span>
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 mr-1">{stats.rating}</span>
                <span className="text-yellow-400">★★★★★</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with User Info */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel Entrenador</h1>
            <p className="text-gray-600">gestiona tus clases y alumnos</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{currentUser?.name || 'Juan Entrenador'}</p>
              <p className="text-xs text-gray-500">trainer@fitlife.cl</p>
              <p className="text-xs text-green-600">Entrenador Certificado</p>
              <p className="text-xs text-gray-500">5 años de experiencia</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className="btn-secondary flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Editar Perfil
              </button>
              <button 
                onClick={handleLogout}
                className="btn-secondary flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Activity },
              { id: 'classes', label: 'Mis Clases', icon: Calendar },
              { id: 'students', label: 'Mis Estudiantes', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'classes' && renderClasses()}
        {activeTab === 'students' && renderStudents()}
        {activeTab === 'profile' && renderProfile()}
      </div>
    </div>
  );
};
