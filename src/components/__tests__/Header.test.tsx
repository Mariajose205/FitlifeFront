import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../Header';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    // Reset window location
    delete window.location;
    window.location = { pathname: '/' } as Location;
  });

  test('renders logo and navigation items', () => {
    renderWithRouter(<Header />);
    
    // Check logo
    expect(screen.getByText('FitLife')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /fitlife/i })).toHaveAttribute('href', '/');
    
    // Check navigation items
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Reservas')).toBeInTheDocument();
    expect(screen.getByText('Gimnasios')).toBeInTheDocument();
    expect(screen.getByText('Pagos')).toBeInTheDocument();
    expect(screen.getByText('Mi Perfil')).toBeInTheDocument();
  });

  test('highlights active navigation item', () => {
    window.location.pathname = '/';
    renderWithRouter(<Header />);
    
    const homeLink = screen.getByText('Inicio');
    expect(homeLink.closest('a')).toHaveClass('text-primary-600');
  });

  test('shows mobile menu button on small screens', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500,
    });

    renderWithRouter(<Header />);
    
    // Mobile menu button should be visible
    const menuButton = screen.getByRole('button');
    expect(menuButton).toBeInTheDocument();
  });

  test('opens and closes mobile menu', () => {
    renderWithRouter(<Header />);
    
    // Mobile menu button
    const menuButton = screen.getByRole('button');
    
    // Initially mobile menu should be closed
    expect(screen.queryByText('Reservas')).not.toBeVisible();
    
    // Click to open mobile menu
    fireEvent.click(menuButton);
    
    // Mobile menu should be open
    expect(screen.getByText('Reservas')).toBeVisible();
    
    // Click to close mobile menu
    fireEvent.click(menuButton);
    
    // Mobile menu should be closed again
    expect(screen.queryByText('Reservas')).not.toBeVisible();
  });

  test('navigation links have correct href attributes', () => {
    renderWithRouter(<Header />);
    
    expect(screen.getByRole('link', { name: /inicio/i })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: /reservas/i })).toHaveAttribute('href', '/reservas');
    expect(screen.getByRole('link', { name: /gimnasios/i })).toHaveAttribute('href', '/gimnasios');
    expect(screen.getByRole('link', { name: /pagos/i })).toHaveAttribute('href', '/pagos');
    expect(screen.getByRole('link', { name: /mi perfil/i })).toHaveAttribute('href', '/perfil');
  });
});
