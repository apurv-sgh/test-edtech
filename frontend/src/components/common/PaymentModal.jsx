import React, { useState } from 'react';
import { FaCreditCard, FaPaypal, FaLock, FaCheckCircle, FaTimes, FaCalendarAlt, FaClock, FaUser, FaVideo, FaComments, FaMobile } from 'react-icons/fa';
import { toast } from 'react-toastify';
import BookingNotification from './BookingNotification';
import { initializePayment, processPayment, pollPaymentStatus, createCashfreeOrder } from '../../api/payments';
import { registerForWebinar } from '../../api/webinars';

const PaymentModal = ({ isOpen, onClose, service, type = 'counsellor' }) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    upiId: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const loadCashfreeScript = () => new Promise((resolve, reject) => {
    const existing = document.getElementById('cashfree-sdk');
    if (existing) return resolve();
    const s = document.createElement('script');
    s.id = 'cashfree-sdk';
    s.src = 'https://sdk.cashfree.com/js/ui/2.0.0/cashfree.prod.js';
    s.onload = resolve;
    s.onerror = reject;
    document.body.appendChild(s);
  });

  const openCashfreeCheckout = async (order) => {
    await loadCashfreeScript();
    if (!window.Cashfree) throw new Error('Cashfree SDK failed to load');
    const cf = new window.Cashfree({ mode: 'production' });
    return new Promise((resolve, reject) => {
      cf.checkout({ paymentSessionId: order?.payment_session_id, orderId: order?.order_id })
        .then(resolve)
        .catch(reject);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      if (type === 'expert') {
        if (!service?._id && !service?.id) {
          throw new Error('Webinar ID missing');
        }
        
        // Check if seminar is free (fee = 0)
        const seminarFee = service?.fee ?? 0;
        if (seminarFee === 0) {
          // Free seminar - direct registration
          const webinarId = service._id || service.id;
          const expertId = service.expertId;
          await registerForWebinar(webinarId, expertId, { source: 'profile' });
          setIsProcessing(false);
          setIsSuccess(true);
          toast.success('Registered for free webinar successfully!');
          setTimeout(() => {
            onClose();
            setIsSuccess(false);
            setFormData({
              cardNumber: '',
              expiryDate: '',
              cvv: '',
              name: '',
              email: '',
              upiId: ''
            });
          }, 1500);
          return;
        }
        // Paid seminar - continue to payment flow below
      }

      if (paymentMethod === 'cashfree') {
        const order = await createCashfreeOrder(
          service.bookingId,
          type === 'counsellor' ? (service?.price || 99) : (service?.fee ?? 0)
        );
        await openCashfreeCheckout(order);
        
        // For paid seminars, register the user after successful payment
        if (type === 'expert') {
          const webinarId = service._id || service.id;
          const expertId = service.expertId;
          await registerForWebinar(webinarId, expertId, { source: 'payment' });
        }
        
        setIsProcessing(false);
        setIsSuccess(true);
        toast.success('Payment initiated via Cashfree!');
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setCreatedBooking(null);
          window.location.reload();
        }, 1500);
        return;
      }

      // Counsellor booking payment flow (demo)
      const paymentInitResponse = await initializePayment(
        service.bookingId,
        paymentMethod,
        type === 'counsellor' ? (service?.price || 99) : (service?.fee ?? 0)
      );

      const paymentDetails = paymentMethod === 'card' ? {
        cardNumber: formData.cardNumber,
        cardBrand: 'Visa',
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        cardholderName: formData.name,
        email: formData.email
      } : paymentMethod === 'upi' ? {
        upiId: formData.upiId,
        cardholderName: formData.name,
        email: formData.email
      } : {
        email: formData.email
      };

      const processResponse = await processPayment(
        paymentInitResponse.data.paymentId,
        paymentDetails
      );

      let paymentResult = { status: processResponse?.data?.status, transactionId: processResponse?.data?.transactionId };
      if (paymentResult.status !== 'completed') {
        paymentResult = await pollPaymentStatus(processResponse.data.paymentId);
      }

      if (paymentResult.status === 'completed') {
        // For paid seminars, register the user after successful payment
        if (type === 'expert') {
          const webinarId = service._id || service.id;
          const expertId = service.expertId;
          await registerForWebinar(webinarId, expertId, { source: 'payment' });
        }
        
        setIsProcessing(false);
        setIsSuccess(true);
        toast.success(`${type === 'counsellor' ? 'Session' : 'Webinar'} booked successfully!`);
        setTimeout(() => {
          onClose();
          setIsSuccess(false);
          setCreatedBooking(null);
          window.location.reload();
        }, 2000);
      } else {
        throw new Error('Payment failed');
      }

    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      toast.error(error.message || 'Payment failed. Please try again.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const getServiceDetails = () => {
    if (type === 'counsellor') {
      return {
        title: service?.title || 'Career Counselling Session',
        duration: service?.duration || '60 minutes',
        icon: <FaComments className="w-6 h-6 text-primary" />,
        features: [
          'One-on-one career guidance',
          'Resume review & optimization',
          'Interview preparation',
          'Career path planning',
          'Follow-up support'
        ]
      };
    } else {
      return {
        title: service?.title || 'Industry Expert Webinar',
        duration: service?.duration || '90 minutes',
        icon: <FaVideo className="w-6 h-6 text-primary" />,
        features: [
          'Live interactive session',
          'Industry insights & trends',
          'Q&A session',
          'Recording access',
          'Certificate of participation'
        ]
      };
    }
  };

  const serviceDetails = getServiceDetails();
  
  // Check if this is a free seminar
  const isFreeSeminar = type === 'expert' && (service?.fee ?? 0) === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl max-w-lg sm:max-w-xl lg:max-w-2xl w-full max-h-[95vh] my-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
            {isSuccess ? 'Registration Successful!' : (isFreeSeminar ? 'Register for Free Webinar' : 'Complete Your Booking')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
          >
            <FaTimes className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {isSuccess ? (
          /* Success State */
          <div className="p-3 sm:p-4 lg:p-6 text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Payment Completed Successfully!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Your {type === 'counsellor' ? 'session' : 'webinar'} has been booked. You'll receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Booking ID: <span className="font-mono text-primary">BK-{Date.now().toString().slice(-6)}</span>
              </p>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <div className="p-3 sm:p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Service Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  Service Details
                </h3>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    {serviceDetails.icon}
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">
                        {serviceDetails.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {serviceDetails.duration}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {serviceDetails.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FaCheckCircle className="w-3 h-3 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  
                                     <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                     <div className="flex justify-between items-center">
                       <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                       <span className="text-xl font-bold text-primary">
                         {isFreeSeminar ? 'Free' : formatPrice(type === 'counsellor' ? (service?.price || 99) : (service?.fee ?? 0))}
                       </span>
                     </div>
                   </div>
                </div>
              </div>

              {/* Payment Form or Free Registration */}
              {isFreeSeminar ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaCheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      Free Webinar Registration
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      This webinar is completely free! Click below to register.
                    </p>
                    <button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${isProcessing ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Registering...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="w-4 h-4" />
                          Register for Free
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button type="button" onClick={() => setPaymentMethod('card')} className={`p-3 border rounded-lg ${paymentMethod==='card'?'border-primary bg-primary/5 text-primary':'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>Card</button>
                  <button type="button" onClick={() => setPaymentMethod('upi')} className={`p-3 border rounded-lg ${paymentMethod==='upi'?'border-primary bg-primary/5 text-primary':'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>UPI</button>
                  <button type="button" onClick={() => setPaymentMethod('cashfree')} className={`p-3 border rounded-lg ${paymentMethod==='cashfree'?'border-primary bg-primary/5 text-primary':'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'}`}>Cashfree</button>
                </div>

                {paymentMethod === 'card' && (
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Card Number</label>
                      <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} placeholder="1234 5678 9012 3456" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expiry Date</label>
                        <input type="text" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} placeholder="MM/YY" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CVV</label>
                        <input type="text" name="cvv" value={formData.cvv} onChange={handleInputChange} placeholder="123" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cardholder Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white" required />
                    </div>
                    <button type="submit" disabled={isProcessing} className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${isProcessing?'bg-gray-300 text-gray-500 cursor-not-allowed':'bg-primary hover:bg-primary-dark text-white'}`}>
                      {isProcessing ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Processing Payment...</>) : (<><FaLock className="w-4 h-4" />Pay {formatPrice(type === 'counsellor' ? (service?.price || 99) : (service?.fee ?? 0))}</>)}
                    </button>
                  </form>
                )}

                {paymentMethod === 'upi' && (
                  <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">UPI ID</label>
                      <input type="text" name="upiId" value={formData.upiId} onChange={handleInputChange} placeholder="username@upi" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white" required />
                    </div>
                    <button type="submit" disabled={isProcessing} className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${isProcessing?'bg-gray-300 text-gray-500 cursor-not-allowed':'bg-primary hover:bg-primary-dark text-white'}`}>
                      {isProcessing ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>Processing Payment...</>) : (<><FaLock className="w-4 h-4" />Pay {formatPrice(type === 'counsellor' ? (service?.price || 99) : (service?.fee ?? 0))}</>)}
                    </button>
                  </form>
                )}

                {paymentMethod === 'cashfree' && (
                  <div className="text-center py-6">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">You will be redirected to Cashfree to complete your payment.</p>
                    <button onClick={handlePayment} disabled={isProcessing} className={`px-6 py-3 rounded-lg font-semibold transition-colors ${isProcessing?'bg-gray-300 text-gray-500 cursor-not-allowed':'bg-primary hover:bg-primary-dark text-white'}`}>
                      {isProcessing ? 'Redirecting…' : 'Continue to Cashfree'}
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <FaLock className="w-3 h-3" />
                  Your payment information is secure and encrypted
                </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Booking Notification */}
      {showNotification && createdBooking && (
        <BookingNotification
          booking={createdBooking}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default PaymentModal; 