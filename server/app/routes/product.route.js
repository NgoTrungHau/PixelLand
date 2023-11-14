const express = require('express');
const multer = require('multer');
const upload = multer();

const products = require('../controllers/product.controller');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new product
router
  .route('/create')
  .post(
    upload.fields([{ name: 'media', maxCount: 5 }]),
    protect,
    products.createProduct,
  );

// Get a list of products
router.route('/').get(products.getProducts);

// Get a specific product by ID
router.route('/:id').get(products.getProductById);

// Update a product
router.route('/:id').patch(protect, products.updateProduct);

// Delete a product
router.route('/:id').delete(protect, products.deleteProduct);

module.exports = router;
