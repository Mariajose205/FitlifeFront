import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { useCart } from '../contexts/CartContext';
import { useRole } from '../contexts/RoleContext';
import { reservasService } from '../services/api';
import { getAuthenticatedUser } from '../utils/userTypeDetection';
import { Search, Filter, Users, MapPin, Calendar, Clock, Star, Plus, Minus, Trash2, ChevronRight, AlertCircle } from 'lucide-react';

interface Class {
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

export const ReservationsPage: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedGym, setSelectedGym] = useState('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [paymentType, setPaymentType] = useState<'day' | 'week' | 'month'>('day');
  const { currentUser } = useRole();
  const { items, addItem, removeItem, updateQuantity, clearCart, getTotal } = useCart();

  // Mock classes data
  const classes: Class[] = [
    {
      id: '1',
      name: 'Spinning Intensivo',
      instructor: 'María González',
      gym: 'FitLife Vitacura',
      date: '2024-05-02',
      time: '06:00 PM',
      duration: '50 min',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      level: 'intermediate',
      enrolled: 15,
      maxSpots: 25,
      description: 'Clase de spinning de alta intensidad con música motivadora y entrenamiento completo.'
    },
    {
      id: '2',
      name: 'Entrenamiento Funcional',
      instructor: 'Carlos Rodríguez',
      gym: 'FitLife Las Condes',
      date: '2024-05-02',
      time: '10:00 AM',
      duration: '45 min',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
      level: 'advanced',
      enrolled: 8,
      maxSpots: 20,
      description: 'Entrenamiento funcional que trabaja todos los grupos musculares con ejercicios variados.'
    },
    {
      id: '3',
      name: 'Boxing',
      instructor: 'Pedro Silva',
      gym: 'FitLife Providencia',
      date: '2024-05-03',
      time: '07:00 PM',
      duration: '60 min',
      price: 18000,
      image: '/src/assets/imagenes/boxeo.png',
      level: 'intermediate',
      enrolled: 12,
      maxSpots: 18,
      description: 'Clase de boxing con técnicas de golpeo y defensa personal.'
    },
    {
      id: '4',
      name: 'Pilates',
      instructor: 'Ana Martínez',
      gym: 'FitLife Vitacura',
      date: '2024-05-03',
      time: '08:00 AM',
      duration: '55 min',
      price: 20000,
      image: '/src/assets/imagenes/pilates.png',
      level: 'beginner',
      enrolled: 10,
      maxSpots: 15,
      description: 'Clase de pilates enfocada en el fortalecimiento del core y flexibilidad.'
    }
  ];

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel === 'all' || classItem.level === selectedLevel;
    const matchesGym = selectedGym === 'all' || classItem.gym === selectedGym;
    return matchesSearch && matchesLevel && matchesGym;
  });

  const handleBooking = (classItem: Class) => {
    setSelectedClass(classItem);
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    if (selectedClass) {
      try {
        const currentUser = getAuthenticatedUser();
        if (!currentUser) {
          alert('Debes iniciar sesión para hacer una reserva');
          return;
        }

        // Crear reserva en el backend
        // Parsear la fecha y hora de la clase
        console.log('Fecha de la clase:', selectedClass.date);
        console.log('Hora de la clase:', selectedClass.time);
        
        // Intentar diferentes formatos de fecha
        let classDateTime;
        try {
          // Formato ISO: YYYY-MM-DDTHH:mm
          classDateTime = new Date(`${selectedClass.date}T${selectedClass.time}`);
          
          // Si es inválido, intentar otros formatos
          if (isNaN(classDateTime.getTime())) {
            // Formato: DD/MM/YYYY HH:mm
            const [day, month, year] = selectedClass.date.split('/');
            const [hours, minutes] = selectedClass.time.split(':');
            classDateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
          }
          
          // Si sigue siendo inválido, usar fecha actual
          if (isNaN(classDateTime.getTime())) {
            console.warn('Fecha inválida, usando fecha actual');
            classDateTime = new Date();
          }
        } catch (e) {
          console.error('Error al parsear fecha:', e);
          classDateTime = new Date();
        }
        
        console.log('Fecha parseada:', classDateTime);
        
        const reservaRequest = {
          idUsuario: parseInt(currentUser.id),
          idHorario: parseInt(selectedClass.id), // Usando el ID de la clase como ID de horario
          idLocation: 1, // ID de location por defecto (debería venir de la clase)
          fechaReserva: new Date().toISOString(),
          fechaClase: classDateTime.toISOString(),
          estado: 'PENDIENTE',
          numeroPersonas: 1
        };

        const response = await reservasService.crearReserva(reservaRequest);
        const reservaCreada = response.data;

        // Add to cart with selected payment type
        addItem({
          id: selectedClass.id,
          name: selectedClass.name,
          instructor: selectedClass.instructor,
          gym: selectedClass.gym,
          gymCoordinates: {
            lat: -33.4489 + Math.random() * 0.1, // Mock coordinates around Santiago
            lng: -70.6693 + Math.random() * 0.1
          },
          date: selectedClass.date,
          time: selectedClass.time,
          duration: selectedClass.duration,
          price: selectedClass.price,
          image: selectedClass.image,
          paymentType: paymentType
        });
        
        setBookingSuccess(true);
        setTimeout(() => {
          setShowBookingModal(false);
          setBookingSuccess(false);
          setSelectedClass(null);
          // Redirect to payment page with reserva ID and cost after successful booking
          window.location.href = `/pago?id=${reservaCreada.id}&cost=${selectedClass.price}`;
        }, 2000);
      } catch (error: any) {
        console.error('Error al crear reserva:', error);
        console.error('Detalle del error:', error.response?.data);
        const errorMessage = error.response?.data?.message || error.message || 'Error desconocido';
        alert(`Error al crear la reserva: ${errorMessage}. Por favor intenta nuevamente.`);
      }
    }
  };

  const handleAddToCart = (classItem: Class, type: 'day' | 'week' | 'month') => {
    addItem({
      id: classItem.id,
      name: classItem.name,
      instructor: classItem.instructor,
      gym: classItem.gym,
      gymCoordinates: {
        lat: -33.4489 + Math.random() * 0.1, // Mock coordinates around Santiago
        lng: -70.6693 + Math.random() * 0.1
      },
      date: classItem.date,
      time: classItem.time,
      duration: classItem.duration,
      price: classItem.price,
      image: classItem.image,
      paymentType: type
    });
  };

  const handleProceedToPayment = async () => {
    try {
      const currentUser = getAuthenticatedUser();
      if (!currentUser) {
        alert('Debes iniciar sesión para hacer una reserva');
        return;
      }

      if (items.length === 0) {
        alert('Tu carrito está vacío');
        return;
      }

      console.log('Usuario autenticado:', currentUser);
      console.log('Items en el carrito:', items);

      // Crear reservas para cada item en el carrito
      const reservasCreadas = [];
      for (const item of items) {
        // Parsear la fecha y hora de la clase
        console.log('Fecha de la clase:', item.date);
        console.log('Hora de la clase:', item.time);
        
        // Intentar diferentes formatos de fecha
        let classDateTime;
        try {
          // Formato ISO: YYYY-MM-DDTHH:mm
          classDateTime = new Date(`${item.date}T${item.time}`);
          
          // Si es inválido, intentar otros formatos
          if (isNaN(classDateTime.getTime())) {
            // Formato: DD/MM/YYYY HH:mm
            const [day, month, year] = item.date.split('/');
            const [hours, minutes] = item.time.split(':');
            classDateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
          }
          
          // Si sigue siendo inválido, usar fecha actual
          if (isNaN(classDateTime.getTime())) {
            console.warn('Fecha inválida, usando fecha actual');
            classDateTime = new Date();
          }
        } catch (e) {
          console.error('Error al parsear fecha:', e);
          classDateTime = new Date();
        }
        
        console.log('Fecha parseada:', classDateTime);
        
        const reservaRequest = {
          idUsuario: parseInt(currentUser.id),
          idHorario: parseInt(item.id),
          idLocation: 1,
          fechaReserva: new Date().toISOString(),
          fechaClase: classDateTime.toISOString(),
          estado: 'PENDIENTE',
          numeroPersonas: 1
        };

        console.log('Creando reserva con datos:', reservaRequest);
        const response = await reservasService.crearReserva(reservaRequest);
        console.log('Reserva creada:', response.data);
        reservasCreadas.push(response.data);
      }

      // Calcular el total
      const total = getTotal();

      // Usar la primera reserva para redirigir al pago
      const primeraReserva = reservasCreadas[0];
      window.location.href = `/pago?id=${primeraReserva.id}&cost=${total}`;
    } catch (error: any) {
      console.error('Error al crear reservas:', error);
      console.error('Detalle del error:', error.response?.data);
      alert(`Error al crear las reservas: ${error.response?.data?.message || error.message}. Por favor intenta nuevamente.`);
    }
  };

  const calculatePrice = (basePrice: number, type: 'day' | 'week' | 'month') => {
    const multiplier = type === 'day' ? 1 : type === 'week' ? 7 : 30;
    return basePrice * multiplier;
  };

  const getAvailabilityColor = (enrolled: number, maxSpots: number) => {
    const percentage = (enrolled / maxSpots) * 100;
    if (percentage >= 90) return 'text-red-600 bg-red-50';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">Reserva tu Clase</h1>
              <p className="text-secondary-600">Encuentra y reserva las clases perfectas para tu rutina de entrenamiento</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar clases, instructores..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                {/* Level Filter */}
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">Todos los niveles</option>
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>

                {/* Gym Filter */}
                <select
                  value={selectedGym}
                  onChange={(e) => setSelectedGym(e.target.value)}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="all">Todos los gimnasios</option>
                  <option value="FitLife Vitacura">FitLife Vitacura</option>
                  <option value="FitLife Las Condes">FitLife Las Condes</option>
                  <option value="FitLife Providencia">FitLife Providencia</option>
                </select>

                {/* Filter Button */}
                <button className="flex items-center justify-center px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtrar
                </button>
              </div>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredClasses.map((classItem) => (
                <div key={classItem.id} className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  {/* Class Image */}
                  <div className="relative h-48">
                    <img
                      src={classItem.image}
                      alt={classItem.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white bg-opacity-90 rounded-full text-sm font-medium text-secondary-900">
                        {classItem.level}
                      </span>
                    </div>
                  </div>

                  {/* Class Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-secondary-900 mb-2">{classItem.name}</h3>
                    <p className="text-secondary-600 text-sm mb-4 line-clamp-2">{classItem.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-secondary-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span>{classItem.instructor}</span>
                      </div>
                      <div className="flex items-center text-sm text-secondary-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{classItem.gym}</span>
                      </div>
                      <div className="flex items-center text-sm text-secondary-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{classItem.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-secondary-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{classItem.time} • {classItem.duration}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-secondary-200">
                      <div className="mb-4">
                        <div className="text-sm text-secondary-600 mb-2">Tipo de pago:</div>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => handleAddToCart(classItem, 'day')}
                            className="px-3 py-2 border border-secondary-300 rounded-lg text-xs hover:bg-secondary-50 transition-colors"
                          >
                            <div className="font-semibold text-secondary-900">Día</div>
                            <div className="text-primary-600">${calculatePrice(classItem.price, 'day').toLocaleString('es-CL')}</div>
                          </button>
                          <button
                            onClick={() => handleAddToCart(classItem, 'week')}
                            className="px-3 py-2 border border-secondary-300 rounded-lg text-xs hover:bg-secondary-50 transition-colors"
                          >
                            <div className="font-semibold text-secondary-900">Semana</div>
                            <div className="text-primary-600">${calculatePrice(classItem.price, 'week').toLocaleString('es-CL')}</div>
                          </button>
                          <button
                            onClick={() => handleAddToCart(classItem, 'month')}
                            className="px-3 py-2 border border-secondary-300 rounded-lg text-xs hover:bg-secondary-50 transition-colors"
                          >
                            <div className="font-semibold text-secondary-900">Mes</div>
                            <div className="text-primary-600">${calculatePrice(classItem.price, 'month').toLocaleString('es-CL')}</div>
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="text-sm text-secondary-500">Precio base:</span>
                          <span className="text-lg font-bold text-primary-600 ml-2">${classItem.price.toLocaleString('es-CL')}</span>
                        </div>
                        <button
                          onClick={() => handleBooking(classItem)}
                          className="btn-primary"
                          disabled={classItem.enrolled >= classItem.maxSpots}
                        >
                          {classItem.enrolled >= classItem.maxSpots ? 'Agotado' : 'Reservar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredClasses.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary-900 mb-2">No se encontraron clases</h3>
                <p className="text-secondary-600">Intenta ajustar los filtros de búsqueda</p>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Tu Carrito</h3>
              
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="w-6 h-6 text-secondary-400" />
                  </div>
                  <p className="text-secondary-600 text-sm">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="bg-secondary-50 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-secondary-900 text-sm">{item.name}</h4>
                            <p className="text-xs text-secondary-600">{item.instructor}</p>
                            <p className="text-xs text-secondary-600">{item.date} • {item.time}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-6 h-6 rounded-full bg-secondary-200 text-secondary-600 hover:bg-secondary-300"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-6 h-6 rounded-full bg-secondary-200 text-secondary-600 hover:bg-secondary-300"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-secondary-900">
                              ${calculatePrice(item.price, item.paymentType).toLocaleString('es-CL')}
                            </p>
                            <p className="text-xs text-secondary-500">
                              {item.paymentType === 'day' ? 'Diario' : item.paymentType === 'week' ? 'Semanal' : 'Mensual'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-secondary-200 pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-secondary-900">Total:</span>
                      <span className="text-xl font-bold text-primary-600">
                        ${getTotal().toLocaleString('es-CL')}
                      </span>
                    </div>
                    
                    <button
                      onClick={handleProceedToPayment}
                      className="w-full btn-primary"
                    >
                      Proceder al Pago
                    </button>
                    
                    <button
                      onClick={clearCart}
                      className="w-full mt-2 text-sm text-secondary-600 hover:text-secondary-800"
                    >
                      Vaciar carrito
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Booking Modal */}
      {showBookingModal && selectedClass && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            {!bookingSuccess ? (
              <>
                <h2 className="text-2xl font-bold text-secondary-900 mb-4">Confirmar Reserva</h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-secondary-900">{selectedClass.name}</h3>
                    <p className="text-sm text-secondary-600">{selectedClass.instructor}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Fecha:</span>
                      <span className="font-medium">{selectedClass.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Hora:</span>
                      <span className="font-medium">{selectedClass.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Duración:</span>
                      <span className="font-medium">{selectedClass.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Gimnasio:</span>
                      <span className="font-medium">{selectedClass.gym}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Tipo de pago
                    </label>
                    <select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value as 'day' | 'week' | 'month')}
                      className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="day">Diario - ${selectedClass.price.toLocaleString('es-CL')}</option>
                      <option value="week">Semanal - ${(selectedClass.price * 7).toLocaleString('es-CL')}</option>
                      <option value="month">Mensual - ${(selectedClass.price * 30).toLocaleString('es-CL')}</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmBooking}
                    className="flex-1 btn-primary"
                  >
                    Confirmar Reserva
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChevronRight className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-secondary-900 mb-2">¡Reserva Confirmada!</h2>
                <p className="text-secondary-600">Redirigiendo al pago...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
