import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { getAuthenticatedUser, logoutUser } from '../utils/userTypeDetection';
import { usuariosService } from '../services/api';
// import { locationsService, reservasService, pagosService, notificacionesService } from '../services/api';
import { 
  Users, 
  UserCheck, 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  Settings, 
  LogOut,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  BarChart3,
  Activity,
  Building,
  FileText,
  Shield,
  MapPin,
  Phone,
  Mail,
  AlertCircle
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  joinDate: string;
  status: 'active' | 'inactive';
  lastPayment: string;
  totalSpent: number;
}

interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  joinDate: string;
  status: 'active' | 'inactive';
  classesCount: number;
  rating: number;
}

interface ClassSession {
  id: string;
  name: string;
  trainer: string;
  date: string;
  time: string;
  capacity: number;
  enrolled: number;
  revenue: number;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'classes' | 'revenue' | 'system'>('revenue');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  // const [locations, setLocations] = useState<any[]>([]);
  // const [reservas, setReservas] = useState<any[]>([]);
  // const [pagos, setPagos] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    totalTrainers: 0,
    activeTrainers: 0,
    monthlyRevenue: 0,
    previousMonthRevenue: 0,
    totalRevenue: 0,
    classesThisMonth: 0,
    occupancyRate: 0
  });
  // const [loading, setLoading] = useState(true);

  // Get current user
  useEffect(() => {
    const user = getAuthenticatedUser();
    setCurrentUser(user);
  }, []);

  // Cargar datos de microservicios
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // setLoading(true);
      
      // Cargar usuarios reales
      setLoadingUsuarios(true);
      const usuariosResponse = await usuariosService.obtenerTodosLosUsuarios();
      setUsuarios(usuariosResponse.data);
      setLoadingUsuarios(false);
      
      // Cargar locations - API deshabilitada para modo local
      // const locationsResponse = await locationsService.obtenerTodasLasLocations();
      // setLocations(locationsResponse.data);
      
      // Cargar reservas (simuladas - necesitaríamos endpoint real)
      // const reservasResponse = await reservasService.obtenerTodasLasReservas();
      // setReservas(reservasResponse.data);
      
      // Cargar pagos (simulados)
      // const pagosResponse = await pagosService.obtenerTodosLosPagos();
      // setPagos(pagosResponse.data);
      
      // Calcular estadísticas basadas en datos reales de usuarios
      const usuariosData = usuariosResponse.data;
      const totalUsers = usuariosData.length;
      const totalTrainers = usuariosData.filter((u: any) => u.rol === 'TRAINER').length;
      const totalAdmins = usuariosData.filter((u: any) => u.rol === 'ADMIN').length;
      const totalClients = usuariosData.filter((u: any) => u.rol === 'USER').length;
      const activeUsers = usuariosData.filter((u: any) => u.activo === true).length;
      
      setStats(prev => ({
        ...prev,
        totalClients: totalClients,
        activeClients: activeUsers - totalTrainers - totalAdmins, // Activos no admin/trainer
        totalTrainers: totalTrainers,
        activeTrainers: usuariosData.filter((u: any) => u.rol === 'TRAINER' && u.activo === true).length,
        monthlyRevenue: 15678900, // Mantener simulado por ahora
        previousMonthRevenue: 14424588,
        totalRevenue: 34164000,
        classesThisMonth: 50, // Mantener simulado
        occupancyRate: 78
      }));
      
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
      setLoadingUsuarios(false);
    } finally {
      // setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleEditUser = (userId: string) => {
    console.log('Edit user:', userId);
    // Aquí podrías abrir un modal o redirigir a una página de edición
    alert(`Editar usuario ID: ${userId}`);
  };

  const handleViewUser = (userId: string) => {
    console.log('View user:', userId);
    alert(`Ver detalles del usuario ID: ${userId}`);
  };

  const handleDeleteUser = async (userId: number) => {
    console.log('Delete user:', userId);
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')) {
      try {
        await usuariosService.eliminarUsuario(userId);
        // Recargar la lista de usuarios
        loadDashboardData();
        alert('Usuario eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        alert('Error al eliminar el usuario. Por favor, intenta nuevamente.');
      }
    }
  };

  const handleEditClass = (classId: string) => {
    console.log('Edit class:', classId);
    alert(`Editar clase ID: ${classId}`);
  };

  const handleViewClass = (classId: string) => {
    console.log('View class:', classId);
    alert(`Ver detalles de la clase ID: ${classId}`);
  };

  const handleEditTrainer = (trainerId: string) => {
    console.log('Edit trainer:', trainerId);
    alert(`Editar entrenador ID: ${trainerId}`);
  };

  const handleViewTrainer = (trainerId: string) => {
    console.log('View trainer:', trainerId);
    alert(`Ver detalles del entrenador ID: ${trainerId}`);
  };

  const handleDeleteTrainer = async (trainerId: number) => {
    console.log('Delete trainer:', trainerId);
    if (window.confirm('¿Estás seguro de que deseas eliminar este entrenador? Esta acción no se puede deshacer.')) {
      try {
        await usuariosService.eliminarUsuario(trainerId);
        // Recargar la lista de usuarios
        loadDashboardData();
        alert('Entrenador eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando entrenador:', error);
        alert('Error al eliminar el entrenador. Por favor, intenta nuevamente.');
      }
    }
  };

  const handleSaveSettings = () => {
    console.log('Saving settings...');
    alert('Configuración guardada exitosamente');
  };
  
  
  const clients: Client[] = [
    {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan.perez@gmail.com',
      phone: '+56 9 1234 5678',
      membershipType: 'Premium',
      joinDate: '2024-01-15',
      status: 'active',
      lastPayment: '2024-04-01',
      totalSpent: 259800
    },
    {
      id: '2',
      name: 'María González',
      email: 'maria.gonzalez@gmail.com',
      phone: '+56 9 8765 4321',
      membershipType: 'Básico',
      joinDate: '2023-06-20',
      status: 'active',
      lastPayment: '2024-04-05',
      totalSpent: 159600
    },
    {
      id: '3',
      name: 'Carlos Rodríguez',
      email: 'carlos.rodriguez@gmail.com',
      phone: '+56 9 2468 1357',
      membershipType: 'Premium',
      joinDate: '2023-11-10',
      status: 'inactive',
      lastPayment: '2024-02-01',
      totalSpent: 319800
    }
  ];

  const trainers: Trainer[] = [
    {
      id: '1',
      name: 'Roberto Silva',
      email: 'roberto.silva@trainer.fitlife.cl',
      phone: '+56 9 1111 2222',
      specialty: 'Musculación',
      joinDate: '2023-01-15',
      status: 'active',
      classesCount: 24,
      rating: 4.8
    },
    {
      id: '2',
      name: 'Ana Martínez',
      email: 'ana.martinez@trainer.fitlife.cl',
      phone: '+56 9 3333 4444',
      specialty: 'Yoga',
      joinDate: '2023-03-20',
      status: 'active',
      classesCount: 18,
      rating: 4.9
    },
    {
      id: '3',
      name: 'Luis Torres',
      email: 'luis.torres@trainer.fitlife.cl',
      phone: '+56 9 5555 6666',
      specialty: 'CrossFit',
      joinDate: '2023-06-10',
      status: 'inactive',
      classesCount: 12,
      rating: 4.6
    }
  ];

  const classes: ClassSession[] = [
    {
      id: '1',
      name: 'Musculación Avanzada',
      trainer: 'Roberto Silva',
      date: '2024-05-05',
      time: '10:00',
      capacity: 20,
      enrolled: 18,
      revenue: 360000
    },
    {
      id: '2',
      name: 'Entrenamiento Funcional',
      trainer: 'Ana Martínez',
      date: '2024-05-05',
      time: '14:00',
      capacity: 15,
      enrolled: 12,
      revenue: 240000
    },
    {
      id: '3',
      name: 'CrossFit Intenso',
      trainer: 'Luis Torres',
      date: '2024-05-05',
      time: '18:00',
      capacity: 25,
      enrolled: 22,
      revenue: 440000
    }
  ];

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Clientes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
            <p className="text-sm text-green-600">{stats.activeClients} activos</p>
          </div>
          <Users className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Entrenadores</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalTrainers}</p>
            <p className="text-sm text-green-600">{stats.activeTrainers} activos</p>
          </div>
          <UserCheck className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
            <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString('es-CL')}</p>
            <p className="text-sm text-green-600">+12.5% vs mes anterior</p>
          </div>
          <DollarSign className="h-8 w-8 text-yellow-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Clases este mes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.classesThisMonth}</p>
            <p className="text-sm text-blue-600">{stats.occupancyRate}% ocupación</p>
          </div>
          <Calendar className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  );

  const renderClients = () => {
    // Filtrar usuarios reales por rol
    const usuariosClientes = usuarios.filter(u => u.rol === 'USER');
    
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Gestión de Clientes</h3>
            <button className="btn-primary flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Nuevo Cliente
            </button>
          </div>
        </div>
        {loadingUsuarios ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Cargando usuarios...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuariosClientes.map((usuario) => (
                  <tr key={usuario.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{usuario.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{usuario.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{usuario.telefono || 'No especificado'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        usuario.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(usuario.fechaCreacion).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewUser(usuario.id.toString())}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditUser(usuario.id.toString())}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(usuario.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderTrainers = () => {
    // Filtrar usuarios reales por rol
    const usuariosTrainers = usuarios.filter(u => u.rol === 'TRAINER');
    
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Gestión de Entrenadores</h3>
            <button className="btn-primary flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Nuevo Entrenador
            </button>
          </div>
        </div>
        {loadingUsuarios ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Cargando usuarios...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entrenador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Teléfono
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Registro
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {usuariosTrainers.map((trainer) => (
                  <tr key={trainer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{trainer.nombre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{trainer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{trainer.telefono || 'No especificado'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        trainer.activo 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {trainer.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(trainer.fechaCreacion).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewTrainer(trainer.id.toString())}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleEditTrainer(trainer.id.toString())}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTrainer(trainer.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  const renderClasses = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Clases de Hoy</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clase
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entrenador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Horario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ocupación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ingresos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((classSession) => (
              <tr key={classSession.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {classSession.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {classSession.trainer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {classSession.time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(classSession.enrolled / classSession.capacity) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-900">
                      {classSession.enrolled}/{classSession.capacity}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${classSession.revenue.toLocaleString('es-CL')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button className="text-blue-600 hover:text-blue-900">
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

  const renderRevenue = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Este Mes</h3>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Ingresos totales</p>
              <p className="text-3xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString('es-CL')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Mes Anterior</h3>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Ingresos totales</p>
              <p className="text-3xl font-bold text-gray-900">${stats.previousMonthRevenue.toLocaleString('es-CL')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Gráfico de Tendencia</h3>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg">Gráfico de ingresos mensuales</p>
          <p className="text-gray-500 text-sm mt-2">Integración con sistema de gráficos pendiente</p>
        </div>
      </div>
    </div>
  );

  const renderBranches = () => {
    // Usar datos reales del servicio de locations
    const branches = locations.map(location => ({
      id: location.id.toString(),
      name: location.nombre,
      address: location.direccion,
      phone: '+56 2 2345 6789', // Podría agregarse phone al entity
      email: `${location.nombre.toLowerCase().replace(/\s+/g, '')}@fitlife.cl`,
      manager: 'Gerente Asignado', // Podría agregarse manager al entity
      clients: location.capacidadActual || 0,
      trainers: Math.floor((location.capacidadMaxima || 20) / 10), // Estimado
      status: location.activa ? 'active' : 'maintenance',
      openDate: '2023-01-15' // Podría agregarse fecha al entity
    }));

    return (
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Gestión de Sucursales</h3>
            <button className="btn-primary flex items-center gap-2">
              <Building className="h-4 w-4" />
              Nueva Sucursal
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sucursal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estadísticas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {branches.map((branch) => (
                <tr key={branch.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{branch.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {branch.address}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {branch.phone}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {branch.email}
                    </div>
                    <div className="text-sm text-gray-500">Gerente: {branch.manager}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{branch.clients} clientes</div>
                    <div>{branch.trainers} entrenadores</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      branch.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {branch.status === 'active' ? 'Activa' : 'Mantenimiento'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="h-4 w-4" />
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
  };

  const renderReports = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Reportes Financieros</h3>
        <div className="space-y-3">
          {[
            { name: 'Reporte Mensual de Ingresos', date: '2024-04-30', type: 'PDF' },
            { name: 'Análisis de Membresías', date: '2024-04-28', type: 'Excel' },
            { name: 'Reporte de Pagos', date: '2024-04-25', type: 'PDF' },
            { name: 'Proyección Trimestral', date: '2024-04-20', type: 'PDF' }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{report.name}</p>
                  <p className="text-xs text-gray-500">{report.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{report.type}</span>
                <button className="text-blue-600 hover:text-blue-900">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Reportes Operativos</h3>
        <div className="space-y-3">
          {[
            { name: 'Asistencia de Clases', date: '2024-04-30', type: 'Excel' },
            { name: 'Rendimiento de Entrenadores', date: '2024-04-29', type: 'PDF' },
            { name: 'Ocupación de Instalaciones', date: '2024-04-28', type: 'PDF' },
            { name: 'Análisis de Horarios Pico', date: '2024-04-27', type: 'Excel' }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{report.name}</p>
                  <p className="text-xs text-gray-500">{report.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">{report.type}</span>
                <button className="text-blue-600 hover:text-blue-900">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración General</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Gimnasio</label>
              <input type="text" defaultValue="FitLife" className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email de Contacto</label>
              <input type="email" defaultValue="contacto@fitlife.cl" className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono de Contacto</label>
              <input type="tel" defaultValue="+56 2 2345 6789" className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dirección Principal</label>
              <input type="text" defaultValue="Av. Las Condes 1000, Santiago" className="input-field w-full" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Políticas del Sistema</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Cancelación de Clases</p>
                <p className="text-xs text-gray-500">Permitir cancelación hasta 2 horas antes</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Notificaciones por Email</p>
                <p className="text-xs text-gray-500">Enviar recordatorios de clases</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Modo Mantenimiento</p>
                <p className="text-xs text-gray-500">Bloquear acceso temporalmente</p>
              </div>
              <input type="checkbox" className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Seguridad</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Actualización Pendiente</p>
                <p className="text-xs text-gray-500">Reiniciar para aplicar cambios</p>
              </div>
            </div>
            <button className="w-full btn-secondary flex items-center justify-center gap-2">
              <Shield className="h-4 w-4" />
              Verificar Seguridad
            </button>
            <button className="w-full btn-secondary flex items-center justify-center gap-2">
              <Settings className="h-4 w-4" />
              Configurar Backup
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary">Guardar Cambios</button>
            <button className="w-full btn-secondary">Restaurar Valores</button>
            <button className="w-full btn-secondary text-red-600 hover:text-red-700">
              Reiniciar Sistema
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Clientes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
            <p className="text-sm text-green-600">{stats.activeClients} activos</p>
          </div>
          <Users className="h-8 w-8 text-blue-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Entrenadores</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalTrainers}</p>
            <p className="text-sm text-green-600">{stats.activeTrainers} activos</p>
          </div>
          <UserCheck className="h-8 w-8 text-green-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
            <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString('es-CL')}</p>
            <p className="text-sm text-green-600">+12.5% vs mes anterior</p>
          </div>
          <DollarSign className="h-8 w-8 text-yellow-600" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Clases este mes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.classesThisMonth}</p>
            <p className="text-sm text-blue-600">{stats.occupancyRate}% ocupación</p>
          </div>
          <Calendar className="h-8 w-8 text-purple-600" />
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Gestión de Usuarios</h3>
          <button className="btn-primary flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Nuevo Usuario
          </button>
        </div>
      </div>
      {loadingUsuarios ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Cargando usuarios...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{usuario.nombre}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{usuario.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      usuario.rol === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                      usuario.rol === 'TRAINER' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {usuario.rol === 'ADMIN' ? 'Administrador' : 
                       usuario.rol === 'TRAINER' ? 'Entrenador' : 'Cliente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      usuario.activo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleViewUser(usuario.id.toString())}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditUser(usuario.id.toString())}
                        className="text-green-600 hover:text-green-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(Number(usuario.id))}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderSystem = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Configuración del Sistema</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Gimnasio</label>
            <input type="text" defaultValue="FitLife" className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email de Contacto</label>
            <input type="email" defaultValue="contacto@fitlife.cl" className="input-field w-full" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono de Contacto</label>
            <input type="tel" defaultValue="+56 2 2345 6789" className="input-field w-full" />
          </div>
          <button 
            onClick={handleSaveSettings}
            className="w-full btn-primary"
          >Guardar Cambios</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Estado del Sistema</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-900">Sistema Operativo</span>
            </div>
            <span className="text-xs text-gray-500">Online</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-900">Base de Datos</span>
            </div>
            <span className="text-xs text-gray-500">Sincronizada</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-900">Último Backup</span>
            </div>
            <span className="text-xs text-gray-500">Hace 2 horas</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header with User Info */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600">Gestiona tu gimnasio de manera eficiente</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{currentUser?.name || 'Administrador'}</p>
              <p className="text-xs text-gray-500">Super Administrador</p>
              <p className="text-xs text-green-600">Sistema Operativo</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setActiveTab('system')}
                className="btn-secondary flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Configuración
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
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'users', label: 'Usuarios', icon: Users },
              { id: 'classes', label: 'Clases', icon: Calendar },
              { id: 'revenue', label: 'Ingresos', icon: DollarSign },
              { id: 'system', label: 'Sistema', icon: Settings }
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
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'classes' && renderClasses()}
        {activeTab === 'revenue' && renderRevenue()}
        {activeTab === 'system' && renderSystem()}
      </div>
    </div>
  );
};
