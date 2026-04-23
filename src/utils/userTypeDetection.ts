export type UserRole = 'admin' | 'trainer' | 'user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  membershipType?: string;
  memberSince?: string;
}

// Domains para detectar tipos de usuario
const ADMIN_DOMAINS = ['fitlife.cl', 'admin.fitlife.cl'];
const TRAINER_DOMAINS = ['trainer.fitlife.cl', 'entrenador.fitlife.cl', 'coach.fitlife.cl'];
const USER_DOMAINS = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'user.fitlife.cl'];

export const detectUserType = (email: string): UserRole => {
  const domain = email.toLowerCase().split('@')[1];
  
  if (ADMIN_DOMAINS.includes(domain)) {
    return 'admin';
  }
  
  if (TRAINER_DOMAINS.includes(domain)) {
    return 'trainer';
  }
  
  // Por defecto es usuario normal
  return 'user';
};

export const getUserRedirectPath = (role: UserRole): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'trainer':
      return '/trainer';
    case 'user':
    default:
      return '/dashboard';
  }
};

// Simulación de base de datos de usuarios
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@fitlife.cl',
    name: 'Administrador FitLife',
    role: 'admin'
  },
  {
    id: '2',
    email: 'trainer@fitlife.cl',
    name: 'Juan Entrenador',
    role: 'trainer',
    membershipType: 'Premium',
    memberSince: '2023-01-15'
  },
  {
    id: '3',
    email: 'maria.gonzalez@email.com',
    name: 'María González',
    role: 'user',
    membershipType: 'Premium',
    memberSince: '2023-01-15'
  }
];

export const authenticateUser = (email: string, password: string): User | null => {
  // Simulación de autenticación
  const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (user && password === 'password123') { // Contraseña simple para demo
    return user;
  }
  
  return null;
};

export const isUserAuthenticated = (): boolean => {
  const userStr = localStorage.getItem('fitlife_user');
  return userStr !== null;
};

export const getAuthenticatedUser = (): User | null => {
  const userStr = localStorage.getItem('fitlife_user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }
  return null;
};

export const setAuthenticatedUser = (user: User): void => {
  localStorage.setItem('fitlife_user', JSON.stringify(user));
};

export const logoutUser = (): void => {
  localStorage.removeItem('fitlife_user');
};
