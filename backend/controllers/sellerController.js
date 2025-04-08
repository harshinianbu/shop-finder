const Seller = require('../models/Seller');
const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');
const { protect, authorizeRoles } = require('../middlewares/auth');

// @desc    Get seller profile
// @route   GET /api/seller/profile
// @access  Private/Seller
const getSellerProfile = asyncHandler(async (req, res) => {
  const seller = await Seller.findById(req.user.id).select('-password');
  
  if (!seller) {
    res.status(404);
    throw new Error('Seller not found');
  }

  res.json(seller);
});

// @desc    Update seller profile
// @route   PUT /api/seller/profile
// @access  Private/Seller
const updateSellerProfile = asyncHandler(async (req, res) => {
  const seller = await Seller.findById(req.user.id);

  if (!seller) {
    res.status(404);
    throw new Error('Seller not found');
  }

  const { name, shopName, location, contactNumber } = req.body;

  seller.name = name || seller.name;
  seller.shopName = shopName || seller.shopName;
  seller.location = location || seller.location;
  seller.contactNumber = contactNumber || seller.contactNumber;

  const updatedSeller = await seller.save();

  res.json({
    _id: updatedSeller._id,
    email: updatedSeller.email,
    name: updatedSeller.name,
    shopName: updatedSeller.shopName,
    location: updatedSeller.location,
    contactNumber: updatedSeller.contactNumber
  });
});

module.exports = {
  getSellerProfile,
  updateSellerProfile
};
