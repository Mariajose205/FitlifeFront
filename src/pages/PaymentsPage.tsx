import React, { useState } from 'react';
import { Header } from '../components/Header';
import { useCart } from '../contexts/CartContext';
import { CreditCard, Smartphone, Shield, Check, Lock, Eye, EyeOff, ShoppingCart } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'webpay';
  name: string;
  icon: React.ReactNode;
  description: string;
  enabled: boolean;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: string;
}

export const PaymentsPage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('webpay');
  const [showCardForm, setShowCardForm] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { items, getTotal, clearCart } = useCart();

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardPassword, setCardPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Mock payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'webpay',
      type: 'webpay',
      name: 'WebPay Plus',
      icon: <Smartphone className="w-6 h-6" />,
      description: 'Pago rápido y seguro con WebPay',
      enabled: true
    },
    {
      id: 'credit',
      type: 'credit',
      name: 'Tarjeta de Crédito',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Visa, Mastercard, American Express',
      enabled: true
    },
    {
      id: 'debit',
      type: 'debit',
      name: 'Tarjeta de Débito',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Tarjetas de débito bancarias',
      enabled: true
    }
  ];

  // Mock transactions
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      date: '2024-04-30',
      description: 'Reserva Spinning Intensivo',
      amount: 12000,
      status: 'completed',
      method: 'WebPay'
    },
    {
      id: '2',
      date: '2024-04-28',
      description: 'Membresía Mensual Premium',
      amount: 45000,
      status: 'completed',
      method: 'Tarjeta de Crédito'
    },
    {
      id: '3',
      date: '2024-04-25',
      description: 'Reserva Entrenamiento Funcional',
      amount: 15000,
      status: 'pending',
      method: 'WebPay'
    },
    {
      id: '4',
      date: '2024-04-22',
      description: 'Clase de Boxing',
      amount: 18000,
      status: 'completed',
      method: 'Tarjeta de Débito'
    },
    {
      id: '5',
      date: '2024-04-20',
      description: 'Reserva Pilates',
      amount: 20000,
      status: 'failed',
      method: 'Tarjeta de Crédito'
    }
  ];

  const resetForm = () => {
    setCardNumber('');
    setCardName('');
    setCardCVV('');
    setCardPassword('');
    setEmail('');
    setPhone('');
    setShowCardForm(false);
    setPaymentSuccess(false);
    setCurrentStep(1);
    clearCart();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return status;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado';
      case 'pending':
        return 'Pendiente';
      case 'failed':
        return 'Fallido';
      default:
        return status;
    }
  };

  const handlePayment = async () => {
    setProcessingPayment(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setProcessingPayment(false);
    setPaymentSuccess(true);
    setCurrentStep(3);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Pagos Seguros</h1>
          <p className="text-secondary-600">Procesa tus pagos de forma segura y rápida</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-8">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      1
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      currentStep >= 1 ? 'text-primary-600' : 'text-gray-500'
                    }`}>Método</span>
                  </div>
                  <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      2
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      currentStep >= 2 ? 'text-primary-600' : 'text-gray-500'
                    }`}>Detalles</span>
                  </div>
                  <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      3
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      currentStep >= 3 ? 'text-primary-600' : 'text-gray-500'
                    }`}>Completado</span>
                  </div>
                </div>
              </div>

              {!paymentSuccess ? (
                <>
                  {/* Cart Summary */}
                  <div className="mb-6">
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <ShoppingCart className="w-5 h-5 text-primary-600 mr-2" />
                        <h3 className="font-semibold text-primary-900">Resumen del Carrito</h3>
                      </div>
                      {items.length === 0 ? (
                        <p className="text-primary-700 text-sm">Tu carrito está vacío</p>
                      ) : (
                        <div className="space-y-2">
                          {items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="text-primary-700">
                                {item.name} ({item.quantity}x {item.paymentType === 'day' ? 'Día' : item.paymentType === 'week' ? 'Semana' : 'Mes'})
                              </span>
                              <span className="font-semibold text-primary-900">
                                ${(item.price * (item.paymentType === 'day' ? 1 : item.paymentType === 'week' ? 7 : 30) * item.quantity).toLocaleString('es-CL')}
                              </span>
                            </div>
                          ))}
                          <div className="border-t border-primary-300 pt-2 mt-2">
                            <div className="flex justify-between font-bold text-primary-900">
                              <span>Total a pagar:</span>
                              <span className="text-lg">${getTotal().toLocaleString('es-CL')}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">Método de pago</h3>
                    <div className="space-y-3">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => {
                            setSelectedMethod(method.id);
                            if (method.type !== 'webpay') {
                              setShowCardForm(true);
                            } else {
                              setShowCardForm(false);
                            }
                          }}
                          className={`w-full p-4 border rounded-lg flex items-center justify-between transition-colors ${
                            selectedMethod === method.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-secondary-200 hover:border-secondary-300'
                          }`}
                          disabled={processingPayment}
                        >
                          <div className="flex items-center">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                              selectedMethod === method.id ? 'bg-primary-600 text-white' : 'bg-secondary-100 text-secondary-600'
                            }`}>
                              {method.icon}
                            </div>
                            <div className="ml-4 text-left">
                              <h4 className="font-semibold text-secondary-900">{method.name}</h4>
                              <p className="text-sm text-secondary-600">{method.description}</p>
                            </div>
                          </div>
                          <div className="w-5 h-5 rounded-full border-2 border-primary-500 flex items-center justify-center">
                            {selectedMethod === method.id && (
                              <div className="w-2.5 h-2.5 bg-primary-500 rounded-full"></div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Card Form */}
                  {showCardForm && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Información de la tarjeta</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Número de tarjeta
                          </label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            disabled={processingPayment}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-secondary-700 mb-2">
                            Nombre del titular
                          </label>
                          <input
                            type="text"
                            placeholder="Juan Pérez"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            disabled={processingPayment}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                              Vencimiento
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardCVV(e.target.value)}
                              className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              disabled={processingPayment}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              value={cardCVV}
                              onChange={(e) => setCardCVV(e.target.value)}
                              className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              disabled={processingPayment}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Contact Information */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-secondary-900 mb-4">Información de contacto</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="correo@ejemplo.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          disabled={processingPayment}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-secondary-700 mb-2">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          placeholder="+56 9 1234 5678"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          disabled={processingPayment}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pay Button */}
                  <button
                    onClick={handlePayment}
                    disabled={items.length === 0 || processingPayment || (showCardForm && (!cardNumber || !cardName || !cardCVV))}
                    className="w-full btn-primary py-3 text-lg font-semibold"
                  >
                    {processingPayment ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />
                        Procesando pago...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 inline-block mr-2" />
                        Pagar ${getTotal().toLocaleString('es-CL')}
                      </>
                    )}
                  </button>
                </>
              ) : (
                /* Success Message */
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary-900 mb-2">¡Pago Exitoso!</h2>
                  <p className="text-secondary-600 mb-6">Tu pago ha sido procesado correctamente</p>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="text-sm text-secondary-600 mb-2">Monto pagado</div>
                    <div className="text-2xl font-bold text-secondary-900">${getTotal().toLocaleString('es-CL')}</div>
                    <div className="text-sm text-secondary-600 mt-2">Transacción: #{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                  </div>
                  <button
                    onClick={resetForm}
                    className="btn-primary"
                  >
                    Realizar otro pago
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Security Info */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6 mb-6">
              <div className="flex items-center mb-3">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-blue-900">Seguridad garantizada</h3>
              </div>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start">
                  <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Encriptación SSL de 256 bits</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Protección contra fraudes</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>PCI DSS compliant</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Monitoreo 24/7</span>
                </li>
              </ul>
            </div>

            {/* Payment Methods Info */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Métodos aceptados</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-secondary-600 mr-3" />
                  <span className="text-sm text-secondary-700">Visa, Mastercard, American Express</span>
                </div>
                <div className="flex items-center">
                  <Smartphone className="w-5 h-5 text-secondary-600 mr-3" />
                  <span className="text-sm text-secondary-700">WebPay Plus</span>
                </div>
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-secondary-600 mr-3" />
                  <span className="text-sm text-secondary-700">Tarjetas de débito</span>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Transacciones recientes</h3>
              <div className="space-y-3">
                {mockTransactions.slice(0, 3).map((transaction) => (
                  <div key={transaction.id} className="border-b border-secondary-100 pb-3 last:border-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-secondary-900 text-sm">{transaction.description}</p>
                        <p className="text-xs text-secondary-500">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-secondary-900 text-sm">
                          ${transaction.amount.toLocaleString('es-CL')}
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                          {getStatusText(transaction.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
