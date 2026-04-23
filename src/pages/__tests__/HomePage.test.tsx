import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../HomePage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('HomePage Component', () => {
  test('renders main sections correctly', () => {
    renderWithRouter(<HomePage />);
    
    // Check hero section
    expect(screen.getByText('TU FITNESS EN UN SOLO LUGAR')).toBeInTheDocument();
    expect(screen.getByText('Reserva tus clases y entrena con nosotros')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /reserva tu clase/i })).toBeInTheDocument();
    
    // Check features section
    expect(screen.getByText('Alta Disponibilidad')).toBeInTheDocument();
    expect(screen.getByText('Pagos Seguros')).toBeInTheDocument();
    expect(screen.getByText('Encuentra tu Gimnasio')).toBeInTheDocument();
    
    // Check popular classes section
    expect(screen.getByText('Clases Populares')).toBeInTheDocument();
    expect(screen.getByText('Spinning Intensivo')).toBeInTheDocument();
    expect(screen.getByText('Entrenamiento Funcional')).toBeInTheDocument();
    expect(screen.getByText('Spinning')).toBeInTheDocument();
  });

  test('displays correct class information', () => {
    renderWithRouter(<HomePage />);
    
    // Check Spinning Intensivo class
    expect(screen.getByText('Spinning Intensivo')).toBeInTheDocument();
    expect(screen.getByText('Sala de Ciclismo')).toBeInTheDocument();
    expect(screen.getByText('06:00 PM')).toBeInTheDocument();
    expect(screen.getByText('60 min')).toBeInTheDocument();
    expect(screen.getByText('María González')).toBeInTheDocument();
    expect(screen.getByText('15 cupos disponibles')).toBeInTheDocument();
    
    // Check Entrenamiento Funcional class
    expect(screen.getByText('Entrenamiento Funcional')).toBeInTheDocument();
    expect(screen.getByText('Área de Pesas')).toBeInTheDocument();
    expect(screen.getByText('10:00 AM')).toBeInTheDocument();
    expect(screen.getByText('45 min')).toBeInTheDocument();
    expect(screen.getByText('Carlos Rodríguez')).toBeInTheDocument();
    expect(screen.getByText('20 cupos disponibles')).toBeInTheDocument();
    
    // Check Spinning class
    expect(screen.getByText('Spinning')).toBeInTheDocument();
    expect(screen.getByText('Sala de Ciclismo')).toBeInTheDocument();
    expect(screen.getByText('06:00 PM')).toBeInTheDocument();
    expect(screen.getByText('50 min')).toBeInTheDocument();
    expect(screen.getByText('Ana Martínez')).toBeInTheDocument();
    expect(screen.getByText('25 cupos disponibles')).toBeInTheDocument();
  });

  test('has reserve buttons for each class', () => {
    renderWithRouter(<HomePage />);
    
    const reserveButtons = screen.getAllByText('Reservar');
    expect(reserveButtons).toHaveLength(3);
    
    reserveButtons.forEach(button => {
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });
  });

  test('has proper navigation links', () => {
    renderWithRouter(<HomePage />);
    
    // Check main CTA link
    const mainCTALink = screen.getByRole('link', { name: /reserva tu clase/i });
    expect(mainCTALink).toHaveAttribute('href', '/login');
  });

  test('displays feature descriptions', () => {
    renderWithRouter(<HomePage />);
    
    expect(screen.getByText(/Sistema escalable que garantiza acceso 24\/7 a tus clases y entrenamientos/)).toBeInTheDocument();
    expect(screen.getByText(/Transacciones protegidas con encriptación de última generación/)).toBeInTheDocument();
    expect(screen.getByText(/Localiza fácilmente nuestras instalaciones y reserva con un clic/)).toBeInTheDocument();
  });

  test('has proper accessibility structure', () => {
    renderWithRouter(<HomePage />);
    
    // Check main heading hierarchy
    const mainHeading = screen.getByRole('heading', { name: 'TU FITNESS EN UN SOLO LUGAR' });
    expect(mainHeading.tagName).toBe('H1');
    
    const sectionHeadings = screen.getAllByRole('heading', { level: 2 });
    expect(sectionHeadings.length).toBeGreaterThanOrEqual(2);
  });

  test('renders images with proper alt text', () => {
    renderWithRouter(<HomePage />);
    
    // Check hero section image
    const heroImage = screen.getByAltText('People exercising');
    expect(heroImage).toBeInTheDocument();
    
    // Check class images
    const spinningIntensivoImage = screen.getByAltText('Spinning Intensivo');
    const functionalImage = screen.getByAltText('Entrenamiento Funcional');
    const spinningImage = screen.getByAltText('Spinning');
    
    expect(spinningIntensivoImage).toBeInTheDocument();
    expect(functionalImage).toBeInTheDocument();
    expect(spinningImage).toBeInTheDocument();
  });
});
