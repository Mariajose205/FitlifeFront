import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { LoginPage } from '../LoginPage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('LoginPage Component', () => {
  test('renders login form elements', () => {
    renderWithRouter(<LoginPage />);
    
    // Check logo and title
    expect(screen.getByText('FitLife')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    
    // Check form fields
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    
    // Check buttons and links
    expect(screen.getByRole('button', { name: /ingresar/i })).toBeInTheDocument();
    expect(screen.getByText(/¿olvidaste tu contraseña\?/i)).toBeInTheDocument();
    expect(screen.getByText(/¿no tienes cuenta\? regístrate/i)).toBeInTheDocument();
  });

  test('allows users to type in email and password fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  test('toggles password visibility', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginPage />);
    
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const toggleButton = screen.getByRole('button', { name: '' }); // Eye icon button
    
    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click to show password
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click to hide password again
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('submits form with email and password', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginPage />);
    
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    // Check loading state
    expect(screen.getByText('Ingresando...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
    
    // Wait for simulated API call to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ingresar/i })).not.toBeDisabled();
    });
  });

  test('validates required fields', async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginPage />);
    
    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    await user.click(submitButton);
    
    // HTML5 validation should trigger
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    
    expect(emailInput).toBeRequired();
    expect(passwordInput).toBeRequired();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('has correct link for registration', () => {
    renderWithRouter(<LoginPage />);
    
    const registerLink = screen.getByRole('link', { name: /regístrate/i });
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  test('has proper accessibility attributes', () => {
    renderWithRouter(<LoginPage />);
    
    // Check form labels are properly associated
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    
    expect(emailInput).toHaveAttribute('id', 'email');
    expect(passwordInput).toHaveAttribute('id', 'password');
    
    // Check button has proper type
    const submitButton = screen.getByRole('button', { name: /ingresar/i });
    expect(submitButton).toHaveAttribute('type', 'submit');
  });
});
