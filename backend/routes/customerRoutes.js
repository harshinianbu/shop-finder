const express = require('express');
const {
  getNearbyShops,
  getShopReviews,
  addShopReview
} = require('../controllers/customerController');
const { protect } = require('../middlewares/auth');

const router = express.Router();

// Get nearby shops
router.get('/shops', protect, getNearbyShops);

// Get shop reviews
router.get('/shops/:id/reviews', protect, getShopReviews);

// Add shop review
router.post('/shops/:id/reviews', protect, addShopReview);

module.exports = router;
