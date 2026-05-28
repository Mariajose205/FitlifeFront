# FitLife Frontend

Aplicación frontend para FitLife, una plataforma de gestión de fitness con clases, reservas y pagos.

## Características

- **Página Principal**: Hero section, características destacadas y clases populares
- **Página de Login**: Formulario de autenticación con validación
- **Diseño Responsivo**: Optimizado para dispositivos móviles y desktop
- **Navegación Moderna**: Header con menú móvil responsivo
- **Testing**: Unit tests con Jest y React Testing Library

## Tecnologías

- **React 18** con TypeScript
- **Vite** como bundler
- **TailwindCSS** para estilos
- **React Router** para navegación
- **Lucide React** para iconos
- **Jest** + **React Testing Library** para testing

## Estructura del Proyecto

```
src/
  components/          # Componentes reutilizables
    Header.tsx        # Header con navegación
    __tests__/        # Tests de componentes
  pages/              # Páginas principales
    HomePage.tsx      # Página principal
    LoginPage.tsx     # Página de login
    __tests__/        # Tests de páginas
  hooks/              # Custom hooks
  utils/              # Utilidades
    clsx.ts          # Utilidad de clases
  test/               # Configuración de tests
    setup.ts         # Setup de Jest
```

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Ejecutar tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Build para producción
npm run build
```

## Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build
- `npm run test` - Ejecuta tests unitarios
- `npm run test:watch` - Tests en modo watch
- `npm run lint` - Linting del código

## Diseño

La aplicación utiliza una paleta de colores claros y modernos:

- **Primario**: Verde (#22c55e) para acciones y elementos importantes
- **Secundario**: Grises claros para backgrounds y elementos neutros
- **Tipografía**: Inter para mejor legibilidad

## Testing

El proyecto incluye tests unitarios completos para:

- **Header Component**: Navegación, responsive, accesibilidad
- **Login Page**: Formulario, validación, interacciones
- **Home Page**: Renderizado de contenido, enlaces, accesibilidad

Para ejecutar todos los tests:
```bash
npm test
```

## Integración con Backend

El frontend está diseñado para conectarse con un backend Spring Boot con microservicios:

- **Usuario**: Gestión de autenticación y perfiles
- **Reservas**: Sistema de reservas de clases
- **Localización**: Gestión de gimnasios y salas
- **Pagos**: Procesamiento de pagos seguros
- **Notificaciones**: Sistema de notificaciones

Las endpoints del backend se configurarán en la fase de integración.

## Deploy

El build de producción genera archivos estáticos optimizados listos para deploy en cualquier servidor web o CDN.
