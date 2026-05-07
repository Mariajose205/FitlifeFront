import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { Dumbbell, ArrowLeft, Shield, Mail, Phone, FileText, AlertCircle } from 'lucide-react';

export const DataProtectionPage: React.FC = () => {
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
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">
              Política de Protección de Datos Personales
            </h1>
            <p className="text-secondary-600">
              Conforme a la Ley N°19.628 sobre Protección de la Vida Privada
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8 text-secondary-700">
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">1. Identificación del Responsable</h2>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Razón Social:</strong> FitLife Spa</p>
                    <p><strong>RUT:</strong> 76.123.456-7</p>
                    <p><strong>Dirección:</strong> Av. Providencia 1234, Santiago, Chile</p>
                  </div>
                  <div>
                    <p><strong>Teléfono:</strong> +56 2 2345 6789</p>
                    <p><strong>Email:</strong> protecciondatos@fitlife.cl</p>
                    <p><strong>Representante Legal:</strong> Juan Pérez García</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">2. Datos Personales Recopilados</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">2.1. Datos de Identificación</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Nombre completo</li>
                    <li>RUT y documento de identidad</li>
                    <li>Fecha de nacimiento</li>
                    <li>Nacionalidad</li>
                    <li>Estado civil</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2.2. Datos de Contacto</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Teléfono móvil y fijo</li>
                    <li>Correo electrónico</li>
                    <li>Dirección postal</li>
                    <li>Región y comuna</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2.3. Datos de Salud y Fitness</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Historial médico básico</li>
                    <li>Objetivos de entrenamiento</li>
                    <li>Medidas corporales</li>
                    <li>Nivel de actividad física</li>
                    <li>Restricciones médicas</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">2.4. Datos de Uso del Servicio</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Historial de clases reservadas</li>
                    <li>Asistencia y progreso</li>
                    <li>Preferencias de entrenamiento</li>
                    <li>Interacciones con entrenadores</li>
                    <li>Datos de pago y facturación</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">3. Finalidad del Tratamiento</h2>
              <div className="bg-secondary-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">Los datos personales son recopilados para:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Gestión del Servicio:</strong> Provisionar y administrar el acceso a clases y servicios</li>
                  <li><strong>Personalización:</strong> Adaptar programas de entrenamiento a las necesidades individuales</li>
                  <li><strong>Comunicación:</strong> Enviar notificaciones, recordatorios y comunicación relevante</li>
                  <li><strong>Facturación:</strong> Emitir facturas y gestionar pagos</li>
                  <li><strong>Mejora del Servicio:</strong> Analizar patrones de uso para mejorar la plataforma</li>
                  <li><strong>Cumplimiento Legal:</strong> Cumplir con obligaciones legales y regulatorias</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">4. Base Legal del Tratamiento</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">4.1. Consentimiento</h3>
                  <p className="leading-relaxed">
                    El tratamiento de tus datos personales se basa en tu consentimiento expreso e informado, 
                    otorgado al aceptar esta política y durante el proceso de registro.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">4.2. Contrato</h3>
                  <p className="leading-relaxed">
                    Los datos son necesarios para la ejecución del contrato de servicios entre tú y FitLife Spa.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">4.3. Obligación Legal</h3>
                  <p className="leading-relaxed">
                    Cumplimos con las disposiciones de la Ley N°19.628 y normativa complementaria.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">5. Derechos ARCO</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-primary-700 mb-2">🔍 Acceso</h3>
                  <p className="leading-relaxed">
                    Tienes derecho a conocer qué datos personales tenemos sobre ti, su origen y finalidad.
                  </p>
                </div>
                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-primary-700 mb-2">✏️ Rectificación</h3>
                  <p className="leading-relaxed">
                    Puedes solicitar la corrección de datos inexactos o incompletos.
                  </p>
                </div>
                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-primary-700 mb-2">🚫 Cancelación</h3>
                  <p className="leading-relaxed">
                    Puedes solicitar la eliminación de tus datos cuando ya no sean necesarios.
                  </p>
                </div>
                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-primary-700 mb-2">⛔ Oposición</h3>
                  <p className="leading-relaxed">
                    Puedes oponerte al tratamiento de tus datos para fines específicos.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">6. ¿Cómo Ejercer tus Derechos?</h2>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-4">Proceso de Solicitud</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-800 mb-2">6.1. Solicitud Escrita</h4>
                    <p className="leading-relaxed">
                      Envía una solicitud escrita a <strong>protecciondatos@fitlife.cl</strong> 
                      con los siguientes datos:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-green-800">
                      <li>Nombre completo y RUT</li>
                      <li>Derecho que deseas ejercer (Acceso, Rectificación, Cancelación u Oposición)</li>
                      <li>Descripción clara de tu solicitud</li>
                      <li>Documentación de respaldo si corresponde</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800 mb-2">6.2. Plazos de Respuesta</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-green-800">
                      <li><strong>10 días hábiles</strong> para responder tu solicitud</li>
                      <li><strong>2 días hábiles</strong> para implementar la decisión</li>
                      <li><strong>5 días hábiles</strong> para comunicar decisiones negativas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800 mb-2">6.3. Gratuidad</h4>
                    <p className="leading-relaxed">
                      El ejercicio de tus derechos ARCO es completamente gratuito.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">7. Medidas de Seguridad</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">7.1. Seguridad Técnica</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Encriptación SSL/TLS en todas las transmisiones</li>
                    <li>Firewalls y sistemas de detección de intrusiones</li>
                    <li>Backups automáticos diarios</li>
                    <li>Autenticación de dos factores disponible</li>
                    <li>Cifrado de bases de datos</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">7.2. Seguridad Organizacional</h3>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Capacitación continua del personal</li>
                    <li>Políticas de acceso restringido</li>
                    <li>Acuerdos de confidencialidad</li>
                    <li>Auditorías de seguridad periódicas</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">8. Tiempo de Conservación</h2>
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                <p className="leading-relaxed">
                  Tus datos personales serán conservados durante el tiempo necesario para cumplir con las 
                  finalidades para las cuales fueron recopilados, considerando:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Relación contractual:</strong> Mientras mantengas una membresía activa</li>
                  <li><strong>Obligaciones legales:</strong> Períodos requeridos por ley</li>
                  <li><strong>Estadísticas:</strong> Datos anonimizados indefinidamente</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">9. Transferencia Internacional</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">9.1. Política General</h3>
                  <p className="leading-relaxed">
                    FitLife no realiza transferencias internacionales de datos personales sin tu 
                    consentimiento explícito, excepto cuando sea requerido por ley.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">9.2. Proveedores de Servicios</h3>
                  <p className="leading-relaxed">
                    Utilizamos proveedores de servicios tecnológicos que pueden procesar datos 
                    fuera de Chile, siempre bajo estrictos estándares de protección.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">10. Contacto del Delegado</h2>
              <div className="bg-secondary-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-2">Delegado de Protección de Datos</h3>
                    <p><strong>Nombre:</strong> Ana María Silva Rodríguez</p>
                    <p><strong>Cargo:</strong> Delegada de Protección de Datos</p>
                    <p><strong>Email:</strong> delegado@fitlife.cl</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Información de Contacto</h3>
                    <p><strong>Teléfono Directo:</strong> +56 2 2345 6790</p>
                    <p><strong>Horario:</strong> Lunes a Viernes 9:00 - 18:00</p>
                    <p><strong>Oficina:</strong> Av. Providencia 1234, Oficina 201</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-secondary-900 mb-4">11. Actualizaciones de esta Política</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">11.1. Notificación de Cambios</h3>
                  <p className="leading-relaxed">
                    Cualquier modificación a esta política será comunicada con al menos 
                    30 días antes de su entrada en vigencia mediante:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Email a los usuarios registrados</li>
                    <li>Publicación en la plataforma</li>
                    <li>Avisos en el panel de usuario</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">11.2. Versión Actual</h3>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p><strong>Versión:</strong> 1.0</p>
                    <p><strong>Fecha de última actualización:</strong> {new Date().toLocaleDateString('es-CL')}</p>
                    <p><strong>Próxima revisión:</strong> Enero 2025</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-8 border-t border-secondary-200 text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-secondary-600">
              <AlertCircle className="w-4 h-4" />
              <span>
                Al hacer clic en "Acepto" durante el registro, confirmas que has leído, 
                entendido y aceptado esta política de protección de datos personales.
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
