import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Discount {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  requiredCard: string;
  validUntil: string;
  image: string;
  terms: string[];
}

interface DiscountContextType {
  currentDiscount: Discount | null;
  showDiscount: boolean;
  applyDiscount: (discountId: string) => void;
  clearDiscount: () => void;
  isDiscountValid: () => boolean;
}

const DiscountContext = createContext<DiscountContextType | undefined>(undefined);

// Mock discounts
const mockDiscounts: Discount[] = [
  {
    id: '1',
    title: '30% de Descuento',
    description: 'En todas tus clases de este mes',
    discountPercentage: 30,
    requiredCard: 'Banco de Chile',
    validUntil: '2026-05-31',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&h=400&fit=crop',
    terms: [
      'Válido solo con tarjeta Banco de Chile',
      'No acumulable con otras promociones',
      'Válido hasta el 31 de mayo de 2026',
      'Aplica solo para clases individuales'
    ]
  },
  {
    id: '2',
    title: '20% de Descuento',
    description: 'En membresías mensuales',
    discountPercentage: 20,
    requiredCard: 'Banco Santander',
    validUntil: '2026-06-15',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop',
    terms: [
      'Válido solo con tarjeta Banco Santander',
      'No acumulable con otras promociones',
      'Válido hasta el 15 de junio de 2026',
      'Aplica solo para nuevas membresías'
    ]
  },
  {
    id: '3',
    title: '25% de Descuento',
    description: 'En paquetes de 10 clases',
    discountPercentage: 25,
    requiredCard: 'Banco Estado',
    validUntil: '2026-05-20',
    image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=600&h=400&fit=crop',
    terms: [
      'Válido solo con tarjeta Banco Estado',
      'No acumulable con otras promociones',
      'Válido hasta el 20 de mayo de 2026',
      'Aplica solo para paquetes de 10 clases'
    ]
  }
];

export const DiscountProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentDiscount, setCurrentDiscount] = useState<Discount | null>(null);
  const [showDiscount, setShowDiscount] = useState(false);

  useEffect(() => {
    // Randomly show or hide discount on page load (70% chance to show)
    const shouldShow = Math.random() < 0.7;
    if (shouldShow) {
      const randomDiscount = mockDiscounts[Math.floor(Math.random() * mockDiscounts.length)];
      setCurrentDiscount(randomDiscount);
      setShowDiscount(true);
    }
  }, []);

  const applyDiscount = (discountId: string) => {
    const discount = mockDiscounts.find(d => d.id === discountId);
    if (discount) {
      setCurrentDiscount(discount);
      setShowDiscount(true);
    }
  };

  const clearDiscount = () => {
    setCurrentDiscount(null);
    setShowDiscount(false);
  };

  const isDiscountValid = () => {
    if (!currentDiscount) return false;
    const today = new Date();
    const validDate = new Date(currentDiscount.validUntil);
    return today <= validDate;
  };

  return (
    <DiscountContext.Provider value={{
      currentDiscount,
      showDiscount,
      applyDiscount,
      clearDiscount,
      isDiscountValid
    }}>
      {children}
    </DiscountContext.Provider>
  );
};

export const useDiscount = (): DiscountContextType => {
  const context = useContext(DiscountContext);
  if (context === undefined) {
    throw new Error('useDiscount must be used within a DiscountProvider');
  }
  return context;
};
