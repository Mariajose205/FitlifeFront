import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Base URLs para los microservicios - Usando proxy de Vite
const BASE_URLS = {
  pagos: '/api/pagos',
  locations: '/api/locations',
  reservas: '/api/reservas',
  notificaciones: '/api/notificaciones',
  usuarios: '/api/usuarios' // Usando proxy a MS-usuarios
};

// Configuración común para Axios
const createAxiosInstance = (baseURL: string): AxiosInstance => {
  return axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// Interceptor para añadir token de autenticación
const addAuthInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('fitlife_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// Instancias de Axios para cada microservicio
export const pagosApi = createAxiosInstance(BASE_URLS.pagos);
export const locationsApi = createAxiosInstance(BASE_URLS.locations);
export const reservasApi = createAxiosInstance(BASE_URLS.reservas);
export const notificacionesApi = createAxiosInstance(BASE_URLS.notificaciones);
export const usuariosApi = createAxiosInstance(BASE_URLS.usuarios);

// Añadir interceptor de autenticación a todas las instancias
addAuthInterceptor(pagosApi);
addAuthInterceptor(locationsApi);
addAuthInterceptor(reservasApi);
addAuthInterceptor(notificacionesApi);
addAuthInterceptor(usuariosApi);

// Tipos de datos para las respuestas
export interface PagoResponse {
  id: number;
  idUsuario: number;
  idReserva: number;
  monto: number;
  fechaPago: string;
  metodoPago: string;
  estado: string;
}

export interface LocationResponse {
  id: number;
  nombre: string;
  direccion: string;
  ciudad: string;
  pais: string;
  capacidadMaxima: number;
  capacidadActual: number;
  activa: boolean;
}

export interface ReservaResponse {
  id: number;
  idUsuario: number;
  idHorario: number;
  idLocation: number;
  fechaReserva: string;
  estado: string;
}

export interface NotificacionResponse {
  id: number;
  destinatario: string;
  asunto: string;
  mensaje: string;
  estado: string;
  fechaCreacion: string;
}

export interface Tarjeta {
  id: number;
  idUsuario: number;
  tipo: 'CREDITO' | 'DEBITO';
  numero: string;
  titular: string;
  fechaVencimiento: string;
  cvv: string;
  saldo: number;
  porDefecto: boolean;
  fechaCreacion: string;
  activo: boolean;
}

export interface UsuarioResponse {
  id: number;
  email: string;
  nombre: string;
  rol: 'ADMIN' | 'TRAINER' | 'USER';
  activo: boolean;
  fechaNacimiento?: string;
  telefono?: string;
  direccion?: string;
}

// Servicios de Pagos
export const pagosService = {
  crearPago: (pagoRequest: any) => pagosApi.post<PagoResponse>('', pagoRequest),
  obtenerPagosPorUsuario: (idUsuario: number) => pagosApi.get<PagoResponse[]>(`/usuario/${idUsuario}`),
  obtenerPagosPorReserva: (idReserva: number) => pagosApi.get<PagoResponse[]>(`/reserva/${idReserva}`),
  obtenerPagoPorId: (idPago: number) => pagosApi.get<PagoResponse>(`/${idPago}`),
  obtenerPagosPorFecha: (fechaInicio: string, fechaFin: string) => 
    pagosApi.get<PagoResponse[]>('/fecha', { params: { fechaInicio, fechaFin } }),
  obtenerTodosLosPagos: () => pagosApi.get<PagoResponse[]>(''),
  healthCheck: () => pagosApi.get<string>('/health'),
};

// Servicios de Locations
export const locationsService = {
  crearLocation: (locationRequest: any) => locationsApi.post<LocationResponse>('', locationRequest),
  obtenerLocationPorId: (id: number) => locationsApi.get<LocationResponse>(`/${id}`),
  obtenerTodasLasLocations: () => locationsApi.get<LocationResponse[]>(''),
  obtenerLocationsActivas: () => locationsApi.get<LocationResponse[]>('/activas'),
  actualizarLocation: (id: number, request: any) => locationsApi.put<LocationResponse>(`/${id}`, request),
  eliminarLocation: (id: number) => locationsApi.delete<void>(`/${id}`),
  desactivarLocation: (id: number) => locationsApi.patch<void>(`/${id}/desactivar`),
  obtenerLocationsConDisponibilidad: () => locationsApi.get<LocationResponse[]>('/disponibles'),
  obtenerLocationsConDisponibilidadYCapacidad: (capacidad: number) => 
    locationsApi.get<LocationResponse[]>(`/disponibles/capacidad/${capacidad}`),
  incrementarCapacidadActual: (id: number) => locationsApi.patch<void>(`/${id}/incrementar-capacidad`),
  decrementarCapacidadActual: (id: number) => locationsApi.patch<void>(`/${id}/decrementar-capacidad`),
  buscarLocationsPorCiudad: (ciudad: string) => locationsApi.get<LocationResponse[]>(`/ciudad/${ciudad}`),
  buscarLocationsPorPais: (pais: string) => locationsApi.get<LocationResponse[]>(`/pais/${pais}`),
  buscarLocationsPorNombre: (nombre: string) => locationsApi.get<LocationResponse[]>('/buscar', { params: { nombre } }),
  buscarLocationsActivasEnCiudad: (ciudad: string) => locationsApi.get<LocationResponse[]>(`/ciudad/${ciudad}/activas-disponibles`),
  buscarLocationsPorRangoCapacidad: (minima: number, maxima: number) => 
    locationsApi.get<LocationResponse[]>('/capacidad/rango', { params: { minima, maxima } }),
  buscarLocationsPorTermino: (termino: string) => locationsApi.get<LocationResponse[]>('/buscar/termino', { params: { termino } }),
  contarLocationsActivas: () => locationsApi.get<number>('/estadisticas/activas/count'),
  contarLocationsConDisponibilidad: () => locationsApi.get<number>('/estadisticas/disponibles/count'),
  obtenerCapacidadPromedio: () => locationsApi.get<number>('/estadisticas/capacidad-promedio'),
};

// Servicios de Reservas
export const reservasService = {
  crearReserva: (reservaRequest: any) => reservasApi.post<ReservaResponse>('', reservaRequest),
  obtenerReservasPorUsuario: (idUsuario: number) => reservasApi.get<ReservaResponse[]>(`/usuario/${idUsuario}`),
  obtenerReservasPorHorario: (idHorario: number) => reservasApi.get<ReservaResponse[]>(`/horario/${idHorario}`),
  contarReservasPorHorario: (idHorario: number) => reservasApi.get<number>(`/horario/${idHorario}/count`),
  actualizarReserva: (idReserva: number, request: any) => reservasApi.put<ReservaResponse>(`/${idReserva}`, request),
  confirmarReserva: (idReserva: number) => reservasApi.patch<ReservaResponse>(`/${idReserva}/confirmar`),
  eliminarReserva: (idReserva: number) => reservasApi.delete<void>(`/${idReserva}`),
};

// Servicios de Notificaciones
export const notificacionesService = {
  crearNotificacion: (notificacionRequest: any) => notificacionesApi.post<NotificacionResponse>('', notificacionRequest),
  obtenerNotificacionPorId: (id: number) => notificacionesApi.get<NotificacionResponse>(`/${id}`),
  obtenerNotificacionesPorDestinatario: (email: string) => notificacionesApi.get<NotificacionResponse[]>(`/destinatario/${email}`),
  obtenerNotificacionesPorEstado: (estado: string) => notificacionesApi.get<NotificacionResponse[]>(`/estado/${estado}`),
  enviarNotificacion: (id: number) => notificacionesApi.post<NotificacionResponse>(`/${id}/enviar`),
  procesarEventoReserva: (evento: any) => notificacionesApi.post<string>('/procesar-reserva', evento),
  obtenerNotificacionesPendientesVencidas: () => notificacionesApi.get<NotificacionResponse[]>('/pendientes-vencidas'),
  contarNotificacionesPorEstado: (estado: string) => notificacionesApi.get<number>(`/contador/estado/${estado}`),
  healthCheck: () => notificacionesApi.get<string>('/health'),
};

// Servicios de Tarjetas
export const tarjetasService = {
  obtenerTarjetasPorUsuario: (idUsuario: number) => 
    pagosApi.get<Tarjeta[]>(`/tarjetas/usuario/${idUsuario}`),
  obtenerTarjetaPredeterminada: (idUsuario: number) => 
    pagosApi.get<Tarjeta>(`/tarjetas/usuario/${idUsuario}/predeterminada`),
  guardarTarjeta: (tarjetaData: any) => 
    pagosApi.post<Tarjeta>('/tarjetas', tarjetaData),
  actualizarTarjeta: (id: number, tarjetaData: any) => 
    pagosApi.put<Tarjeta>(`/tarjetas/${id}`, tarjetaData),
  actualizarSaldoTarjeta: (id: number, saldo: number) => 
    pagosApi.put<Tarjeta>(`/tarjetas/${id}/saldo`, {saldo}),
  eliminarTarjeta: (id: number) => 
    pagosApi.delete<void>(`/tarjetas/${id}`),
  marcarComoPredeterminada: (id: number, idUsuario: number) => 
    pagosApi.put<Tarjeta>(`/tarjetas/${id}/predeterminada/${idUsuario}`, {})
};

// Servicios de Usuarios (simulado - necesitarás implementar el backend)
export const usuariosService = {
  login: (credentials: { email: string; password: string }) => 
    usuariosApi.post<{ token: string; user: UsuarioResponse }>('/login', credentials),
  register: (userData: any) => usuariosApi.post<UsuarioResponse>('/register', userData),
  obtenerUsuarioPorEmail: (email: string) => usuariosApi.get<UsuarioResponse>(`/email/${email}`),
  obtenerUsuarioPorId: (id: number) => usuariosApi.get<UsuarioResponse>(`/${id}`),
  actualizarUsuario: (id: number, userData: any) => usuariosApi.put<UsuarioResponse>(`/${id}`, userData),
  eliminarUsuario: (id: number) => usuariosApi.delete<void>(`/${id}`),
  obtenerTodosLosUsuarios: () => usuariosApi.get<UsuarioResponse[]>(''),
};

export default {
  pagosService,
  locationsService,
  reservasService,
  notificacionesService,
  usuariosService,
  tarjetasService,
};
