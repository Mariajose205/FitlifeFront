import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Dumbbell, Calendar, MapPin, Users, Clock, Filter, Search, Star } from 'lucide-react';

export const MainDashboard: React.FC = () => {
  const [selectedGym, setSelectedGym] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 10 sucursales en Chile con comunas reales
  const gymLocations = [
    { id: '1', name: 'FitLife Vitacura', comuna: 'Vitacura', address: 'Av. Manquehue 1234', phone: '+56 2 2345 6789', rating: 4.8 },
    { id: '2', name: 'FitLife Las Condes', comuna: 'Las Condes', address: 'Apoquindo 4567', phone: '+56 2 2345 6790', rating: 4.7 },
    { id: '3', name: 'FitLife Providencia', comuna: 'Providencia', address: 'Av. Providencia 2345', phone: '+56 2 2345 6791', rating: 4.9 },
    { id: '4', name: 'FitLife Ñuñoa', comuna: 'Ñuñoa', address: 'Av. Irarrázaval 3456', phone: '+56 2 2345 6792', rating: 4.6 },
    { id: '5', name: 'FitLife La Florida', comuna: 'La Florida', address: 'Vicuña Mackenna 5678', phone: '+56 2 2345 6793', rating: 4.5 },
    { id: '6', name: 'FitLife Maipú', comuna: 'Maipú', address: 'Av. Pajaritos 6789', phone: '+56 2 2345 6794', rating: 4.4 },
    { id: '7', name: 'FitLife San Miguel', comuna: 'San Miguel', address: 'Av. Alameda 7890', phone: '+56 2 2345 6795', rating: 4.7 },
    { id: '8', name: 'FitLife La Reina', comuna: 'La Reina', address: 'Av. Larraín 8901', phone: '+56 2 2345 6796', rating: 4.8 },
    { id: '9', name: 'FitLife Peñalolén', comuna: 'Peñalolén', address: 'Av. Grecia 9012', phone: '+56 2 2345 6797', rating: 4.6 },
    { id: '10', name: 'FitLife Puente Alto', comuna: 'Puente Alto', address: 'Av. Concha y Toro 0123', phone: '+56 2 2345 6798', rating: 4.5 }
  ];

  const trainers = [
    { id: '1', name: 'María González', specialty: 'Yoga', experience: '8 años', rating: 4.9, classes: ['Yoga Flow', 'Yoga Power', 'Meditación'] },
    { id: '2', name: 'Carlos Rodríguez', specialty: 'Entrenamiento Funcional', experience: '6 años', rating: 4.8, classes: ['CrossFit', 'Entrenamiento Funcional', 'HIIT'] },
    { id: '3', name: 'Ana Martínez', specialty: 'Spinning', experience: '5 años', rating: 4.7, classes: ['Spinning', 'Ciclismo Indoor', 'Cardio Dance'] },
    { id: '4', name: 'Pedro Sánchez', specialty: 'Boxing', experience: '10 años', rating: 4.9, classes: ['Boxing', 'Kickboxing', 'Defensa Personal'] },
    { id: '5', name: 'Laura Silva', specialty: 'Pilates', experience: '7 años', rating: 4.8, classes: ['Pilates', 'Reformer', 'Stretching'] },
    { id: '6', name: 'Diego Torres', specialty: 'Musculación', experience: '9 años', rating: 4.7, classes: ['Músculos', 'Power Lifting', 'Bodybuilding'] },
    { id: '7', name: 'Sofía Valdés', specialty: 'Danza', experience: '4 años', rating: 4.6, classes: ['Zumba', 'Danza Fitness', 'Bachata Fitness'] },
    { id: '8', name: 'Matías Castro', specialty: 'Natación', experience: '6 años', rating: 4.8, classes: ['Natación', 'Acuafitness', 'Salvavidas'] }
  ];

  const classes = [
    { id: '1', name: 'Yoga Flow', trainer: 'María González', gym: 'FitLife Vitacura', date: '2024-01-15', time: '08:00 AM', duration: '60 min', spots: 15, maxSpots: 20, level: 'Principiante' },
    { id: '2', name: 'Spinning Intensivo', trainer: 'Ana Martínez', gym: 'FitLife Las Condes', date: '2024-01-15', time: '06:00 PM', duration: '45 min', spots: 8, maxSpots: 25, level: 'Intermedio' },
    { id: '3', name: 'Boxing', trainer: 'Pedro Sánchez', gym: 'FitLife Providencia', date: '2024-01-16', time: '07:00 PM', duration: '50 min', spots: 12, maxSpots: 15, level: 'Avanzado', image: '/src/assets/imagenes/boxeo.png' },
    { id: '4', name: 'Entrenamiento Funcional', trainer: 'Carlos Rodríguez', gym: 'FitLife Ñuñoa', date: '2024-01-16', time: '10:00 AM', duration: '60 min', spots: 18, maxSpots: 20, level: 'Intermedio' },
    { id: '5', name: 'Pilates Reformer', trainer: 'Laura Silva', gym: 'FitLife La Florida', date: '2024-01-17', time: '09:00 AM', duration: '55 min', spots: 10, maxSpots: 12, level: 'Principiante', image: '/src/assets/imagenes/pilates.png' },
    { id: '6', name: 'Zumba Fitness', trainer: 'Sofía Valdés', gym: 'FitLife Maipú', date: '2024-01-17', time: '06:00 PM', duration: '60 min', spots: 20, maxSpots: 30, level: 'Principiante' },
    { id: '7', name: 'Natación', trainer: 'Matías Castro', gym: 'FitLife San Miguel', date: '2024-01-18', time: '07:00 AM', duration: '45 min', spots: 15, maxSpots: 20, level: 'Intermedio' },
    { id: '8', name: 'Power Lifting', trainer: 'Diego Torres', gym: 'FitLife La Reina', date: '2024-01-18', time: '05:00 PM', duration: '75 min', spots: 8, maxSpots: 12, level: 'Avanzado' },
    { id: '9', name: 'Meditación', trainer: 'María González', gym: 'FitLife Peñalolén', date: '2024-01-19', time: '08:30 AM', duration: '30 min', spots: 25, maxSpots: 30, level: 'Principiante' },
    { id: '10', name: 'HIIT', trainer: 'Carlos Rodríguez', gym: 'FitLife Puente Alto', date: '2024-01-19', time: '06:30 PM', duration: '40 min', spots: 14, maxSpots: 18, level: 'Avanzado' }
  ];

  // Filter classes based on selected gym and search
  const filteredClasses = classes.filter(cls => {
    const matchesGym = selectedGym === 'all' || cls.gym === selectedGym;
    const matchesSearch = searchTerm === '' || 
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.trainer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesGym && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Welcome Header */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-6">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Bienvenido a FitLife</h1>
          <p className="text-secondary-600">Reserva tus clases y descubre nuestros gimnasios en todo Chile</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar clases o entrenadores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10 w-full"
                />
              </div>
            </div>
            
            {/* Gym Filter */}
            <div className="lg:w-64">
              <select
                value={selectedGym}
                onChange={(e) => setSelectedGym(e.target.value)}
                className="input-field w-full"
              >
                <option value="all">Todos los gimnasios</option>
                {gymLocations.map(gym => (
                  <option key={gym.id} value={gym.name}>{gym.name}</option>
                ))}
              </select>
            </div>
            
            {/* Date Filter */}
            <div className="lg:w-48">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field w-full"
              />
            </div>
          </div>
        </div>

        {/* Gym Locations Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">Nuestras Sucursales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {gymLocations.map(gym => (
              <div key={gym.id} className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <h3 className="font-semibold text-secondary-900">{gym.name}</h3>
                </div>
                <div className="space-y-1 text-sm text-secondary-600">
                  <p><strong>Comuna:</strong> {gym.comuna}</p>
                  <p><strong>Dirección:</strong> {gym.address}</p>
                  <p><strong>Teléfono:</strong> {gym.phone}</p>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium text-secondary-900">{gym.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Classes Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-secondary-900">Clases Disponibles</h2>
            <div className="flex items-center space-x-2 text-sm text-secondary-600">
              <Filter className="w-4 h-4" />
              <span>{filteredClasses.length} clases encontradas</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map(cls => (
              <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden hover:shadow-lg transition-shadow">
                {/* Class Header */}
                <div className="bg-primary-600 text-white p-4">
                  <h3 className="text-lg font-semibold mb-1">{cls.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary-100">{cls.gym}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cls.level === 'Principiante' ? 'bg-green-100 text-green-700' :
                      cls.level === 'Intermedio' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {cls.level}
                    </span>
                  </div>
                </div>
                
                {/* Class Details */}
                <div className="p-4">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-secondary-600">
                      <Users className="w-4 h-4" />
                      <span>Entrenador: <strong>{cls.trainer}</strong></span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-secondary-600">
                      <Calendar className="w-4 h-4" />
                      <span>{cls.date}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-secondary-600">
                      <Clock className="w-4 h-4" />
                      <span>{cls.time} - {cls.duration}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-secondary-600">Cupos disponibles:</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-full bg-secondary-200 rounded-full h-2 w-20">
                          <div 
                            className="h-2 bg-primary-600 rounded-full"
                            style={{ width: `${(cls.spots / cls.maxSpots) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-secondary-900">
                          {cls.spots}/{cls.maxSpots}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full btn-primary">
                    Reservar Clase
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trainers Section */}
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">Nuestros Entrenadores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trainers.map(trainer => (
              <div key={trainer.id} className="bg-white rounded-lg shadow-sm border border-secondary-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">{trainer.name}</h3>
                    <p className="text-sm text-primary-600">{trainer.specialty}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-600">Experiencia:</span>
                    <span className="font-medium text-secondary-900">{trainer.experience}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium text-secondary-900">{trainer.rating}</span>
                  </div>
                  
                  <div className="pt-2">
                    <div className="text-xs text-secondary-600 mb-1">Clases:</div>
                    <div className="flex flex-wrap gap-1">
                      {trainer.classes.map((cls, index) => (
                        <span key={index} className="text-xs bg-secondary-100 text-secondary-700 px-2 py-1 rounded">
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
