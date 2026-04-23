import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Dumbbell, Shield, MapPin, Calendar, Users, Clock } from 'lucide-react';

export const HomePage: React.FC = () => {
  const popularClasses = [
    {
      id: 1,
      name: 'Spinning Intensivo',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop',
      location: 'Sala de Ciclismo',
      time: '06:00 PM',
      duration: '60 min',
      instructor: 'María González',
      spots: 15,
    },
    {
      id: 2,
      name: 'Entrenamiento Funcional',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      location: 'Área de Pesas',
      time: '10:00 AM',
      duration: '45 min',
      instructor: 'Carlos Rodríguez',
      spots: 20,
    },
    {
      id: 3,
      name: 'Spinning',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
      location: 'Sala de Ciclismo',
      time: '06:00 PM',
      duration: '50 min',
      instructor: 'Ana Martínez',
      spots: 25,
    },
  ];

  const features = [
    {
      icon: Dumbbell,
      title: 'Alta Disponibilidad',
      description: 'Sistema escalable que garantiza acceso 24/7 a tus clases y entrenamientos',
    },
    {
      icon: Shield,
      title: 'Pagos Seguros',
      description: 'Transacciones protegidas con encriptación de última generación',
    },
    {
      icon: MapPin,
      title: 'Encuentra tu Gimnasio',
      description: 'Localiza fácilmente nuestras instalaciones y reserva con un clic',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-primary-600 to-primary-700 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=600&fit=crop"
            alt="People exercising"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              TU FITNESS EN UN SOLO LUGAR
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Reserva tus clases y entrena con nosotros
            </p>
            <Link
              to="/login"
              className="inline-block bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-colors duration-200"
            >
              Reserva tu Clase
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Classes Section */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-12 text-center">
            Clases Populares
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularClasses.map((classItem) => (
              <div key={classItem.id} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <img
                    src={classItem.image}
                    alt={classItem.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-primary-600">
                    {classItem.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    {classItem.name}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-secondary-600 text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      {classItem.location}
                    </div>
                    <div className="flex items-center text-secondary-600 text-sm">
                      <Clock className="w-4 h-4 mr-2" />
                      {classItem.time}
                    </div>
                    <div className="flex items-center text-secondary-600 text-sm">
                      <Users className="w-4 h-4 mr-2" />
                      {classItem.instructor}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-500">
                      {classItem.spots} cupos disponibles
                    </span>
                    <button className="btn-primary text-sm px-4 py-2">
                      Reservar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
