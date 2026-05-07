import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Dumbbell, ArrowLeft } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Back Button */}
        <Link
          to="/register"
          className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Registro</span>
        </Link>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Términos y Condiciones
            </h1>
            <p className="text-secondary-600">
              FitLife Spa - Última actualización: {new Date().toLocaleDateString('es-CL')}
            </p>
          </div>

          {/* Terms Content */}
          <div className="space-y-8 text-secondary-700">
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">1. Aceptación de los Términos</h2>
              <p className="leading-relaxed">
                Al acceder y utilizar los servicios de FitLife, aceptas estos términos y condiciones en su totalidad. 
                Si no estás de acuerdo con alguno de estos términos, no debes utilizar nuestros servicios.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">2. Descripción del Servicio</h2>
              <p className="leading-relaxed mb-4">
                FitLife es una plataforma de gestión de servicios fitness que incluye:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Reserva de clases y entrenamientos</li>
                <li>Gestión de membresías y pagos</li>
                <li>Seguimiento de progreso y actividades</li>
                <li>Comunicación con entrenadores</li>
                <li>Acceso a instalaciones participantes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">3. Registro y Cuentas</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">3.1. Requisitos de Registro</h3>
                  <p className="leading-relaxed">
                    Para registrarte debes ser mayor de 18 años y proporcionar información veraz y completa. 
                    Te comprometes a mantener tu información actualizada.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3.2. Tipos de Cuenta</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Usuario Normal:</strong> Acceso a reservas y seguimiento personal</li>
                    <li><strong>Entrenador:</strong> Gestión de clases y seguimiento de clientes</li>
                    <li><strong>Administrador:</strong> Control total del sistema</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">3.3. Seguridad de la Cuenta</h3>
                  <p className="leading-relaxed">
                    Eres responsable de mantener la confidencialidad de tus credenciales de acceso. 
                    FitLife no se hace responsable del acceso no autorizado a tu cuenta.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">4. Membresías y Pagos</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">4.1. Planes de Membresía</h3>
                  <p className="leading-relaxed">
                    Ofrecemos diferentes planes de membresía con variados niveles de acceso y beneficios. 
                    Los precios están sujetos a cambios sin previo aviso.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">4.2. Métodos de Pago</h3>
                  <p className="leading-relaxed">
                    Aceptamos pagos mediante tarjetas de crédito/débito, transferencias bancarias 
                    y otros métodos electrónicos autorizados en Chile.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">4.3. Facturación</h3>
                  <p className="leading-relaxed">
                    Los cargos se realizan mensualmente y se emiten facturas electrónicas 
                    conforme a la normativa tributaria chilena.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">5. Uso del Servicio</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">5.1. Conducta del Usuario</h3>
                  <p className="leading-relaxed">
                    Te comprometes a utilizar nuestros servicios de manera responsable, respetando 
                    a otros usuarios, entrenadores y personal de FitLife.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">5.2. Prohibiciones</h3>
                  <p className="leading-relaxed mb-2">Está estrictamente prohibido:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Utilizar el servicio para fines ilegales</li>
                    <li>Compartir credenciales de acceso</li>
                    <li>Realizar reservas falsas o maliciosas</li>
                    <li>Hostigar o discriminar a otros usuarios</li>
                    <li>Dañar la propiedad o instalaciones</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">6. Cancelación y Reembolsos</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">6.1. Cancelación de Clases</h3>
                  <p className="leading-relaxed">
                    Las clases pueden cancelarse con hasta 2 horas de antelación sin costo. 
                    Cancelaciones tardías pueden generar cargos según el plan contratado.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">6.2. Cancelación de Membresía</h3>
                  <p className="leading-relaxed">
                    Puedes cancelar tu membresía en cualquier momento. Los reembolsos 
                    se calcularán proporcionalmente al tiempo restante del período.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">7. Propiedad Intelectual</h2>
              <p className="leading-relaxed">
                Todo el contenido de FitLife, incluyendo但不 limitado a logos, diseños, textos, 
                software y funcionalidades, es propiedad intelectual de FitLife Spa y está protegido 
                por las leyes de propiedad intelectual chilenas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">8. Limitación de Responsabilidad</h2>
              <p className="leading-relaxed">
                FitLife no se responsabiliza por lesiones, accidentes o daños que ocurran 
                durante la utilización de nuestras instalaciones o servicios. Los usuarios utilizan 
                los servicios bajo su propio riesgo.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">9. Modificaciones de los Términos</h2>
              <p className="leading-relaxed">
                FitLife se reserva el derecho de modificar estos términos en cualquier momento. 
                Las modificaciones entrarán en vigencia desde su publicación en la plataforma 
                y se notificarán a los usuarios registrados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">10. Ley Aplicable y Jurisdicción</h2>
              <p className="leading-relaxed">
                Estos términos se rigen por las leyes de la República de Chile. 
                Cualquier controversia se resolverá en los tribunales competentes de Santiago, Chile.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">11. Contacto</h2>
              <div className="bg-secondary-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Para consultas sobre estos términos:</p>
                <div className="space-y-1">
                  <p><strong>Email:</strong> legal@fitlife.cl</p>
                  <p><strong>Teléfono:</strong> +56 2 2345 6789</p>
                  <p><strong>Dirección:</strong> Av. Providencia 1234, Santiago, Chile</p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-secondary-200 text-center">
            <p className="text-sm text-secondary-600">
              Al hacer clic en "Acepto" durante el registro, confirmas que has leído, 
              entendido y aceptado estos términos y condiciones.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
