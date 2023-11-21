const express = require('express');
const multer = require('multer');
const upload = multer();

const orders = require('../controllers/order.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new order
router.route('/create').post(protect, orders.createOrder1);
// paypal
router.route('/create-paypal-order').post(orders.createPaypalOrder);
router.route('/:orderID/capture').post(orders.createOrder1);

// Get a list of orders
router.route('/').get(orders.getOrders);

// Get a specific order by ID
router.route('/:id').get(orders.getOrderById);

// Update a order
router.route('/:id').patch(protect, orders.updateOrder);

// Delete a order
router.route('/:id').delete(protect, orders.deleteOrder);

module.exports = router;
