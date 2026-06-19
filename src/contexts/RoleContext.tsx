import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'TRAINER' | 'ADMIN';
  avatar?: string;
  phone?: string;
  joinDate?: string;
}

interface RoleContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: 'USER' | 'TRAINER' | 'ADMIN') => void;
  hasRole: (role: 'USER' | 'TRAINER' | 'ADMIN') => boolean;
  isAdmin: () => boolean;
  isTrainer: () => boolean;
  isUser: () => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Mock users for different roles
const mockUsers: Record<string, User> = {
  USER: {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    role: 'USER',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phone: '+56 9 1234 5678',
    joinDate: '2026-01-15'
  },
  TRAINER: {
    id: '2',
    name: 'María González',
    email: 'maria.gonzalez@example.com',
    role: 'TRAINER',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332c1ca?w=150&h=150&fit=crop&crop=face',
    phone: '+56 9 8765 4321',
    joinDate: '2023-06-20'
  },
  ADMIN: {
    id: '3',
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@example.com',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    phone: '+56 9 2468 1357',
    joinDate: '2023-01-10'
  }
};

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers.USER);

  const switchRole = (role: 'USER' | 'TRAINER' | 'ADMIN') => {
    setCurrentUser(mockUsers[role]);
  };

  const hasRole = (role: 'USER' | 'TRAINER' | 'ADMIN') => {
    return currentUser?.role === role;
  };

  const isAdmin = () => hasRole('ADMIN');
  const isTrainer = () => hasRole('TRAINER');
  const isUser = () => hasRole('USER');

  return (
    <RoleContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        hasRole,
        isAdmin,
        isTrainer,
        isUser
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
