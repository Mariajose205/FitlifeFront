import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'USER' | 'TRAINER' | 'ADMIN';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  location?: string;
}

interface RoleContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  hasRole: (role: UserRole) => boolean;
  isAdmin: boolean;
  isTrainer: boolean;
  isUser: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Mock users for testing
const mockUsers: Record<UserRole, User> = {
  USER: {
    id: '1',
    name: 'María González',
    email: 'maria.gonzalez@email.com',
    role: 'USER',
    phone: '+56 9 1234 5678',
    location: 'Santiago, Chile'
  },
  TRAINER: {
    id: '2',
    name: 'Juan Entrenador',
    email: 'trainer@fitlife.cl',
    role: 'TRAINER',
    phone: '+56 9 8765 4321',
    location: 'Santiago, Chile'
  },
  ADMIN: {
    id: '3',
    name: 'Administrador',
    email: 'admin@fitlife.cl',
    role: 'ADMIN',
    phone: '+56 9 1111 2222',
    location: 'Santiago, Chile'
  }
};

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<User>(mockUsers.USER);

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
  };

  const switchRole = (role: UserRole) => {
    setCurrentUserState(mockUsers[role]);
  };

  const hasRole = (role: UserRole): boolean => {
    return currentUser.role === role;
  };

  const isAdmin = currentUser.role === 'ADMIN';
  const isTrainer = currentUser.role === 'TRAINER';
  const isUser = currentUser.role === 'USER';

  return (
    <RoleContext.Provider value={{
      currentUser,
      setCurrentUser,
      switchRole,
      hasRole,
      isAdmin,
      isTrainer,
      isUser
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
