import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { useDiscount } from '../contexts/DiscountContext';
import { Dumbbell, Shield, MapPin, Calendar, Users, Clock, ChevronLeft, ChevronRight, Tag, CreditCard } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const navigate = useNavigate();
  const { currentDiscount, showDiscount, applyDiscount, clearDiscount } = useDiscount();

  // Redirect to gyms page if user is already authenticated
  // Comentado para permitir ver HomePage cuando el usuario está autenticado
  // useEffect(() => {
  //   const user = getAuthenticatedUser();
  //   if (user) {
  //     navigate('/gimnasios', { replace: true });
  //   }
  // }, []);

  const handleOfferClick = () => {
    if (currentDiscount) {
      applyDiscount(currentDiscount.id);
    }
  };

  const handleDismissOffer = () => {
    clearDiscount();
    setCurrentSlideIndex(0);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 0 ? 1 : 0));
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === 1 ? 0 : 1));
  };

  const handleSlideIndicatorClick = (index: number) => {
    setCurrentSlideIndex(index);
  };

  const handleReserveClass = (_classItem: any) => {
    // Redirect to login since user is not authenticated
    navigate('/login');
  };

  const popularClasses = [
    {
      id: 1,
      name: 'Spinning Intensivo',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      location: 'Sala de Ciclismo',
      time: '06:00 PM',
      duration: '50 min',
      instructor: 'Ana Martínez',
      spots: 15,
    },
    {
      id: 2,
      name: 'Entrenamiento Funcional',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop',
      location: 'Área de Pesas',
      time: '10:00 AM',
      duration: '45 min',
      instructor: 'Carlos Rodríguez',
      spots: 20,
    },
    {
      id: 3,
      name: 'Boxing',
      image: '/src/assets/imagenes/boxeo.png',
      location: 'Ring Principal',
      time: '07:00 PM',
      duration: '60 min',
      instructor: 'Pedro Silva',
      spots: 12,
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
      
      {/* Hero Section with Carousel */}
      <section className="relative h-[600px] bg-gradient-to-r from-primary-600 to-primary-700 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={currentSlideIndex === 0 
              ? "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=600&fit=crop"
              : "/src/assets/imagenes/fondo-oferta.jpg"
            }
            alt={currentSlideIndex === 0 ? "People exercising" : "Special offer"}
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        
        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="relative w-full overflow-hidden">
            {/* Slides Container */}
            <div 
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentSlideIndex * 100}%)` }}
            >
              {/* Slide 1: Original Content */}
              <div className="min-w-full flex items-center justify-center">
                <div className="text-center text-white px-4">
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
              
              {/* Slide 2: Offer Content */}
              <div className="min-w-full flex items-center justify-center">
                {showDiscount && currentDiscount ? (
                  <div className="text-center text-white px-4 max-w-2xl">
                    <div className="mb-6">
                      <Tag className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                      <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        {currentDiscount.title}
                      </h2>
                      <p className="text-xl md:text-2xl text-primary-100 mb-6">
                        {currentDiscount.description}
                      </p>
                    </div>
                    
                    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 mb-8">
                      <div className="flex items-center justify-center mb-4">
                        <CreditCard className="w-8 h-8 mr-3" />
                        <span className="text-2xl font-bold text-yellow-300">
                          {currentDiscount.discountPercentage}% OFF
                        </span>
                      </div>
                      <p className="text-lg mb-2">
                        Código: <span className="font-mono bg-black bg-opacity-30 px-2 py-1 rounded">FITLIFE30</span>
                      </p>
                      <p className="text-sm text-primary-200">
                        Válido hasta: {currentDiscount.validUntil}
                      </p>
                    </div>
                    
                    <div className="flex justify-center">
                      <button
                        onClick={handleOfferClick}
                        className="bg-yellow-400 text-primary-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors duration-200"
                      >
                        Aplicar Descuento
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-white px-4">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                      OFERTAS EXCLUSIVAS
                    </h2>
                    <p className="text-xl md:text-2xl text-primary-100">
                      No hay ofertas disponibles en este momento
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Arrows */}
            {showDiscount && currentDiscount && (
              <>
                <button
                  onClick={handlePrevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 hover:bg-opacity-30 transition-colors duration-200"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={handleNextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-3 hover:bg-opacity-30 transition-colors duration-200"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Slide Indicators */}
            {showDiscount && currentDiscount && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <button
                  onClick={() => handleSlideIndicatorClick(0)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    currentSlideIndex === 0 ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
                <button
                  onClick={() => handleSlideIndicatorClick(1)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    currentSlideIndex === 1 ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              </div>
            )}
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
                    <button 
                      onClick={() => handleReserveClass(classItem)}
                      className="btn-primary text-sm px-4 py-2"
                    >
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
