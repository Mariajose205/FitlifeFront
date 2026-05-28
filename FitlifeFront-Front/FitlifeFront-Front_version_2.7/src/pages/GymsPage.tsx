import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { useCart } from '../contexts/CartContext';
import { MapPin, Phone, Clock, Star, Navigation, Search, Filter, Users, Dumbbell, Check, AlertCircle, X, Map } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Gym {
  id: string;
  name: string;
  address: string;
  comuna: string;
  phone: string;
  rating: number;
  distance: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  amenities: string[];
  openingHours: {
    [key: string]: string;
  };
  image: string;
  description: string;
  classes: number;
  trainers: number;
}

// Fix Leaflet default icon issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom gym icon
const gymIcon = L.divIcon({
  html: '<div style="background-color: #3B82F6; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
  className: 'custom-gym-marker'
});

// User location icon
const userIcon = L.divIcon({
  html: '<div style="background-color: #10B981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
  className: 'custom-user-marker'
});

// Reservation icon
const reservationIcon = L.divIcon({
  html: '<div style="background-color: #F59E0B; width: 25px; height: 25px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><svg width="12" height="12" fill="white" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"/></svg></div>',
  iconSize: [25, 25],
  iconAnchor: [12.5, 12.5],
  popupAnchor: [0, -12.5],
  className: 'custom-reservation-marker'
});

// Component to center map on gym location
const MapController: React.FC<{ center: [number, number], zoom?: number }> = ({ center, zoom = 15 }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export const GymsPage: React.FC = () => {
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);
  const [showGpsModal, setShowGpsModal] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedComuna, setSelectedComuna] = useState('all');
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');
  const [loading, setLoading] = useState(true);
  const [showGymModal, setShowGymModal] = useState(false);
  const { items: cartItems } = useCart();

  // Check for welcome message on component mount
  useEffect(() => {
    const message = localStorage.getItem('welcome_message');
    if (message) {
      setWelcomeMessage(message);
      // Remove the message after displaying it
      localStorage.removeItem('welcome_message');
    }
  }, []);

  // Mock gyms data with real coordinates in Santiago
  const mockGyms: Gym[] = [
    {
      id: '1',
      name: 'FitLife Vitacura',
      address: 'Av. Vitacura 5421',
      comuna: 'Vitacura',
      phone: '+56 2 2345 6780',
      rating: 4.8,
      distance: 2.3,
      coordinates: { lat: -33.4489, lng: -70.6693 },
      amenities: ['Piscina', 'Sauna', 'Estacionamiento', 'Cafetería'],
      openingHours: {
        'Lunes': '6:00 - 22:00',
        'Martes': '6:00 - 22:00',
        'Miércoles': '6:00 - 22:00',
        'Jueves': '6:00 - 22:00',
        'Viernes': '6:00 - 22:00',
        'Sábado': '7:00 - 20:00',
        'Domingo': '7:00 - 20:00'
      },
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop',
      description: 'Gimnasio premium con equipamiento de última generación y entrenadores certificados.',
      classes: 45,
      trainers: 12
    },
    {
      id: '2',
      name: 'FitLife Las Condes',
      address: 'Apoquindo 3456',
      comuna: 'Las Condes',
      phone: '+56 2 2345 6781',
      rating: 4.6,
      distance: 3.7,
      coordinates: { lat: -33.4265, lng: -70.6107 },
      amenities: ['Spa', 'Yoga Studio', 'Nutricionista', 'Tienda'],
      openingHours: {
        'Lunes': '5:30 - 23:00',
        'Martes': '5:30 - 23:00',
        'Miércoles': '5:30 - 23:00',
        'Jueves': '5:30 - 23:00',
        'Viernes': '5:30 - 23:00',
        'Sábado': '6:00 - 21:00',
        'Domingo': '6:00 - 21:00'
      },
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop',
      description: 'Espacio moderno con foco en bienestar integral y clases grupales variadas.',
      classes: 38,
      trainers: 10
    },
    {
      id: '3',
      name: 'FitLife Providencia',
      address: 'Manuel Montt 234',
      comuna: 'Providencia',
      phone: '+56 2 2345 6782',
      rating: 4.7,
      distance: 1.8,
      coordinates: { lat: -33.4345, lng: -70.6418 },
      amenities: ['CrossFit', 'Piscina', 'Sala de spinning', 'Lockers'],
      openingHours: {
        'Lunes': '6:00 - 22:00',
        'Martes': '6:00 - 22:00',
        'Miércoles': '6:00 - 22:00',
        'Jueves': '6:00 - 22:00',
        'Viernes': '6:00 - 22:00',
        'Sábado': '7:00 - 20:00',
        'Domingo': '7:00 - 20:00'
      },
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop',
      description: 'Gimnasio especializado en entrenamiento funcional y deportes de combate.',
      classes: 52,
      trainers: 15
    },
    {
      id: '4',
      name: 'FitLife Ñuñoa',
      address: 'Irarrázaval 1234',
      comuna: 'Ñuñoa',
      phone: '+56 2 2345 6783',
      rating: 4.5,
      distance: 4.2,
      coordinates: { lat: -33.4593, lng: -70.6077 },
      amenities: ['Rutina guiada', 'Zumba', 'Pilates', 'Estacionamiento'],
      openingHours: {
        'Lunes': '6:00 - 22:00',
        'Martes': '6:00 - 22:00',
        'Miércoles': '6:00 - 22:00',
        'Jueves': '6:00 - 22:00',
        'Viernes': '6:00 - 22:00',
        'Sábado': '7:00 - 20:00',
        'Domingo': '7:00 - 20:00'
      },
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=400&fit=crop',
      description: 'Ambiente familiar con programas adaptados para todas las edades y niveles.',
      classes: 35,
      trainers: 8
    }
  ];

  useEffect(() => {
    // Simulate loading gyms data
    setTimeout(() => {
      setGyms(mockGyms);
      setLoading(false);
    }, 1000);

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const filteredGyms = gyms
    .filter(gym => {
      const matchesSearch = gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gym.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesComuna = selectedComuna === 'all' || gym.comuna === selectedComuna;
      return matchesSearch && matchesComuna;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const openGoogleMaps = (gym: Gym) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${gym.coordinates.lat},${gym.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const openGpsModal = (gym: Gym) => {
    setSelectedGym(gym);
    setShowGpsModal(true);
  };

  const closeGpsModal = () => {
    setShowGpsModal(false);
    setSelectedGym(null);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />

      {/* Welcome Message Banner */}
      {welcomeMessage && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Dumbbell className="w-5 h-5 text-green-600 mr-3" />
                <span className="text-green-800 font-medium">{welcomeMessage}</span>
              </div>
              <button
                onClick={() => setWelcomeMessage(null)}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Nuestros Gimnasios</h1>
          <p className="text-secondary-600">Encuentra el gimnasio más cercano y empieza tu transformación</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar gimnasios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Comuna Filter */}
            <select
              value={selectedComuna}
              onChange={(e) => setSelectedComuna(e.target.value)}
              className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">Todas las comunas</option>
              <option value="Vitacura">Vitacura</option>
              <option value="Las Condes">Las Condes</option>
              <option value="Providencia">Providencia</option>
              <option value="Ñuñoa">Ñuñoa</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating' | 'name')}
              className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="distance">Ordenar por distancia</option>
              <option value="rating">Ordenar por rating</option>
              <option value="name">Ordenar por nombre</option>
            </select>

            {/* Filter Button */}
            <button className="flex items-center justify-center px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filtrar
            </button>
          </div>
        </div>

        {/* Gyms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredGyms.map((gym) => (
            <div key={gym.id} className="bg-white rounded-xl shadow-sm border border-secondary-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Gym Image */}
              <div className="relative h-48">
                <img
                  src={gym.image}
                  alt={gym.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-primary-600">
                  {gym.distance.toFixed(1)} km
                </div>
              </div>

              {/* Gym Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-secondary-900 mb-1">{gym.name}</h3>
                    <p className="text-secondary-600 text-sm mb-2">{gym.address}</p>
                    <p className="text-sm text-secondary-500">{gym.comuna}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center mb-1">
                      {renderStars(gym.rating)}
                    </div>
                    <span className="text-sm text-secondary-600">({gym.rating})</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center text-secondary-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {gym.phone}
                  </div>
                  <div className="flex items-center text-secondary-600">
                    <Dumbbell className="w-4 h-4 mr-2" />
                    {gym.classes} clases
                  </div>
                  <div className="flex items-center text-secondary-600">
                    <Users className="w-4 h-4 mr-2" />
                    {gym.trainers} entrenadores
                  </div>
                  <div className="flex items-center text-secondary-600">
                    <Clock className="w-4 h-4 mr-2" />
                    6:00 - 22:00
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => openGpsModal(gym)}
                    className="flex-1 btn-secondary text-sm"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Cómo Llegar
                  </button>
                  <button
                    onClick={() => {
                      setSelectedGym(gym);
                      setShowGymModal(true);
                    }}
                    className="flex-1 btn-primary text-sm"
                  >
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredGyms.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">No se encontraron gimnasios</h3>
            <p className="text-secondary-600">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </main>

      {/* Gym Details Modal */}
      {showGymModal && selectedGym && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="relative h-48">
              <img
                src={selectedGym.image}
                alt={selectedGym.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setShowGymModal(false)}
                className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-secondary-900 mb-4">{selectedGym.name}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-3">Información</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-secondary-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {selectedGym.address}
                    </div>
                    <div className="flex items-center text-secondary-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {selectedGym.phone}
                    </div>
                    <div className="flex items-center text-secondary-600">
                      <Star className="w-4 h-4 mr-2" />
                      {selectedGym.rating} ⭐
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-secondary-900 mb-3">Horarios</h3>
                  <div className="space-y-1 text-sm">
                    {Object.entries(selectedGym.openingHours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="text-secondary-600">{day}:</span>
                        <span className="font-medium">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-secondary-900 mb-3">Descripción</h3>
                <p className="text-secondary-600">{selectedGym.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-secondary-900 mb-3">Servicios</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedGym.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                      <Check className="w-3 h-3 mr-1" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => openGpsModal(selectedGym)}
                  className="flex-1 btn-secondary"
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Cómo Llegar
                </button>
                <button
                  onClick={() => setShowGymModal(false)}
                  className="flex-1 btn-primary"
                >
                  Reservar Clase
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GPS Modal */}
      {showGpsModal && selectedGym && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center">
                <Map className="w-6 h-6 mr-3" />
                <h2 className="text-xl font-bold">Cómo llegar a {selectedGym.name}</h2>
              </div>
              <button
                onClick={closeGpsModal}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Gym Info */}
              <div className="mb-6">
                <div className="flex items-start mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <MapPin className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-1">{selectedGym.name}</h3>
                    <p className="text-secondary-600 mb-2">{selectedGym.address}</p>
                    <p className="text-sm text-secondary-500">{selectedGym.comuna}</p>
                  </div>
                </div>
              </div>

              {/* Map Container */}
              <div className="mb-6">
                <div className="bg-gray-100 rounded-lg h-96 overflow-hidden">
                  {selectedGym && (
                    <div className="h-full w-full">
                      {/* OpenStreetMap iframe - Free GPS */}
                      <iframe
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedGym.coordinates.lng - 0.01},${selectedGym.coordinates.lat - 0.01},${selectedGym.coordinates.lng + 0.01},${selectedGym.coordinates.lat + 0.01}&layer=mapnik&marker=${selectedGym.coordinates.lat},${selectedGym.coordinates.lng}`}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        title={`Mapa de ${selectedGym.name}`}
                      />
                      
                      {/* Gym info overlay */}
                      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
                        <div className="flex items-center mb-2">
                          <MapPin className="w-5 h-5 text-red-500 mr-2" />
                          <h4 className="font-semibold text-sm">{selectedGym.name}</h4>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{selectedGym.address}</p>
                        <p className="text-xs text-gray-500">{selectedGym.comuna}</p>
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs font-medium text-gray-900">Coordenadas:</p>
                          <p className="text-xs text-gray-600">
                            {selectedGym.coordinates.lat.toFixed(4)}, {selectedGym.coordinates.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Distance Info */}
              {userLocation && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <Navigation className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-semibold text-blue-900">Distancia desde tu ubicación</p>
                      <p className="text-blue-700">
                        {selectedGym.distance.toFixed(1)} km - aproximadamente {Math.ceil(selectedGym.distance * 12)} minutos en auto
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    openGoogleMaps(selectedGym);
                    closeGpsModal();
                  }}
                  className="btn-primary flex items-center justify-center py-3"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Abrir en Google Maps
                </button>
                <button
                  onClick={() => {
                    // Copy address to clipboard
                    navigator.clipboard.writeText(`${selectedGym.name}, ${selectedGym.address}, ${selectedGym.comuna}`);
                    closeGpsModal();
                  }}
                  className="btn-secondary flex items-center justify-center py-3"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Copiar Dirección
                </button>
              </div>

              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center text-secondary-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {selectedGym.phone}
                  </div>
                  <div className="flex items-center text-secondary-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Lunes a Viernes: 6:00 - 22:00
                  </div>
                  <div className="flex items-center text-secondary-600">
                    <Star className="w-4 h-4 mr-2" />
                    {selectedGym.rating} ⭐
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
