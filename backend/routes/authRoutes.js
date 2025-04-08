const express = require('express');
const {
  registerCustomer,
  registerSeller,
  loginUser
} = require('../controllers/authController');

const router = express.Router();

// Customer registration
router.post('/register/customer', registerCustomer);

// Seller registration
router.post('/register/seller', registerSeller);

// Login for both customer and seller
router.post('/login', loginUser);

module.exports = router;
