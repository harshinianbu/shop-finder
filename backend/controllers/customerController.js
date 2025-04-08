const Seller = require('../models/Seller');
const Review = require('../models/Review');
const asyncHandler = require('express-async-handler');
const { protect } = require('../middlewares/auth');

// @desc    Get nearby shops
// @route   GET /api/customer/shops
// @access  Private
const getNearbyShops = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.user.id);
  
  if (!customer) {
    res.status(404);
    throw new Error('Customer not found');
  }

  // Simple location-based filtering (would be enhanced with geospatial queries in production)
  const shops = await Seller.find({ 
    location: { $regex: customer.location, $options: 'i' } 
  }).select('-password');

  res.json(shops);
});

// @desc    Get shop reviews
// @route   GET /api/customer/shops/:id/reviews
// @access  Private
const getShopReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ seller: req.params.id })
    .populate('customer', 'email location');

  res.json(reviews);
});

// @desc    Add shop review
// @route   POST /api/customer/shops/:id/reviews
// @access  Private
const addShopReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    res.status(400);
    throw new Error('Please add a rating and comment');
  }

  const review = await Review.create({
    rating,
    comment,
    customer: req.user.id,
    seller: req.params.id
  });

  res.status(201).json(review);
});

module.exports = {
  getNearbyShops,
  getShopReviews,
  addShopReview
};
