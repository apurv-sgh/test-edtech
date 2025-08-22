const express = require('express');
const router = express.Router();
const {
  initializePayment,
  processPayment,
  getPaymentStatus,
  getPaymentHistory
} = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Payment routes
router.post('/initialize', authMiddleware(), initializePayment);
router.post('/process', authMiddleware(), processPayment);
router.get('/:paymentId/status', authMiddleware(), getPaymentStatus);
router.get('/history', authMiddleware(), getPaymentHistory);

module.exports = router;
