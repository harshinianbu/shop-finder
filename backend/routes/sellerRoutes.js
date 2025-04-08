const express = require('express');
const {
  getSellerProfile,
  updateSellerProfile
} = require('../controllers/sellerController');
const { protect, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// Get seller profile
router.get('/profile', protect, authorizeRoles('seller'), getSellerProfile);

// Update seller profile
router.put('/profile', protect, authorizeRoles('seller'), updateSellerProfile);

module.exports = router;
