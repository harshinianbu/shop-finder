const express = require('express');
const {
  createProduct,
  getSellerProducts
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// Create product (seller only)
router.post('/', createProduct);

// Get seller's products (seller only)
router.get('/seller', protect, authorizeRoles('seller'), getSellerProducts);

module.exports = router;
