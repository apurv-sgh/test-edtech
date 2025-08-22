# Payment Integration Guide

## Overview
This project now includes a comprehensive payment system that supports multiple payment methods including Credit Card, UPI, and PayPal. The system is designed to be easily extensible for real payment gateways like Razorpay, PayPal, etc.

## Current Features

### Payment Methods Supported
1. **Credit Card** - Standard card payment with validation
2. **UPI** - Indian Unified Payment Interface
3. **PayPal** - International payment gateway

### Payment Flow
1. **Booking Creation** - User creates a booking
2. **Payment Initialization** - Payment record is created
3. **Payment Processing** - Payment is processed (simulated)
4. **Status Polling** - Real-time status updates
5. **Booking Confirmation** - Booking is confirmed after successful payment

## Backend Components

### Models
- **Payment Model** (`backend/models/Payment.js`)
  - Tracks payment transactions
  - Supports multiple payment methods
  - Includes refund handling
  - Stores gateway responses

### Controllers
- **Payment Controller** (`backend/controllers/paymentController.js`)
  - `initializePayment` - Creates payment record
  - `processPayment` - Processes payment (simulated)
  - `getPaymentStatus` - Gets payment status
  - `getPaymentHistory` - Gets user's payment history

### Routes
- **Payment Routes** (`backend/routes/paymentRoutes.js`)
  - POST `/api/payments/initialize`
  - POST `/api/payments/process`
  - GET `/api/payments/:paymentId/status`
  - GET `/api/payments/history`

## Frontend Components

### Payment Modal
- **Location**: `frontend/Student_dashboard/src/components/common/PaymentModal.jsx`
- **Features**:
  - Multiple payment method selection
  - Form validation
  - Real-time payment processing
  - Success/failure handling
  - Booking notification

### API Service
- **Location**: `frontend/Student_dashboard/src/api/payments.js`
- **Functions**:
  - `initializePayment()`
  - `processPayment()`
  - `getPaymentStatus()`
  - `getPaymentHistory()`
  - `pollPaymentStatus()`

## Integration Points

### Counsellor Booking Flow
1. User selects counsellor and time slot
2. Booking is created in pending status
3. PaymentModal is opened
4. User completes payment
5. Booking status is updated to confirmed
6. Counsellor availability is updated

### Industry Expert Webinar Flow
1. User selects webinar
2. PaymentModal is opened
3. User completes payment
4. Webinar registration is confirmed

## Real Payment Gateway Integration

### Razorpay Integration
To integrate with Razorpay:

1. **Install Razorpay SDK**:
   ```bash
   npm install razorpay
   ```

2. **Update Payment Controller**:
   ```javascript
   const Razorpay = require('razorpay');
   
   const razorpay = new Razorpay({
     key_id: process.env.RAZORPAY_KEY_ID,
     key_secret: process.env.RAZORPAY_KEY_SECRET
   });
   ```

3. **Create Order**:
   ```javascript
   const order = await razorpay.orders.create({
     amount: amount * 100, // Razorpay expects amount in paise
     currency: 'INR',
     receipt: `receipt_${Date.now()}`
   });
   ```

4. **Verify Payment**:
   ```javascript
   const paymentVerification = razorpay.webhooks.constructEvent(
     req.body,
     req.headers['x-razorpay-signature'],
     process.env.RAZORPAY_WEBHOOK_SECRET
   );
   ```

### PayPal Integration
To integrate with PayPal:

1. **Install PayPal SDK**:
   ```bash
   npm install @paypal/checkout-server-sdk
   ```

2. **Update Payment Controller**:
   ```javascript
   const paypal = require('@paypal/checkout-server-sdk');
   
   const environment = new paypal.core.SandboxEnvironment(
     process.env.PAYPAL_CLIENT_ID,
     process.env.PAYPAL_CLIENT_SECRET
   );
   const client = new paypal.core.PayPalHttpClient(environment);
   ```

3. **Create Order**:
   ```javascript
   const request = new paypal.orders.OrdersCreateRequest();
   request.prefer("return=representation");
   request.requestBody({
     intent: 'CAPTURE',
     purchase_units: [{
       amount: {
         currency_code: 'USD',
         value: amount
       }
     }]
   });
   ```

## Environment Variables
Add these to your `.env` file:

```env
# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# PayPal
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox  # or 'live'

# Payment Settings
PAYMENT_CURRENCY=INR
PAYMENT_SUCCESS_URL=http://localhost:5173/payment/success
PAYMENT_FAILURE_URL=http://localhost:5173/payment/failure
```

## Testing

### Test Payment Data
- **Card**: Use test card numbers (e.g., 4111 1111 1111 1111)
- **UPI**: Use test UPI IDs (e.g., test@upi)
- **PayPal**: Use PayPal sandbox accounts

### Payment Status Simulation
The current system simulates payment processing with:
- 90% success rate
- 2-second processing time
- Real-time status polling

## Security Considerations

1. **Never store sensitive data** like CVV, full card numbers
2. **Use HTTPS** for all payment communications
3. **Validate payment signatures** from payment gateways
4. **Implement webhook verification** for payment confirmations
5. **Use environment variables** for API keys
6. **Implement rate limiting** on payment endpoints

## Future Enhancements

1. **Multiple Currency Support**
2. **Subscription Payments**
3. **Partial Refunds**
4. **Payment Analytics**
5. **Invoice Generation**
6. **Tax Calculation**
7. **Multi-language Support**

## Troubleshooting

### Common Issues
1. **Payment not processing**: Check API keys and network connectivity
2. **Status not updating**: Verify webhook endpoints
3. **Booking not confirming**: Check payment status polling
4. **Form validation errors**: Ensure all required fields are filled

### Debug Mode
Enable debug logging by setting:
```env
PAYMENT_DEBUG=true
```

This will log all payment-related operations for debugging.
