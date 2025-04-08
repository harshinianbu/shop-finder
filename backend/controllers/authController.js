const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Customer = require('../models/Customer');
const Seller = require('../models/Seller');
const asyncHandler = require('express-async-handler');

// @desc    Register new customer
// @route   POST /api/auth/register/customer
// @access  Public
const registerCustomer = asyncHandler(async (req, res) => {
  const { email, password, location } = req.body;

  if (!email || !password || !location) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if customer exists
  const customerExists = await Customer.findOne({ email });
  if (customerExists) {
    res.status(400);
    throw new Error('Customer already exists');
  }

  // Create customer
  const customer = await Customer.create({
    email,
    password,
    location
  });

  if (customer) {
    res.status(201).json({
      _id: customer.id,
      email: customer.email,
      role: customer.role,
      token: generateToken(customer._id, customer.role)
    });
  } else {
    res.status(400);
    throw new Error('Invalid customer data');
  }
});

// @desc    Register new seller
// @route   POST /api/auth/register/seller
// @access  Public
const registerSeller = asyncHandler(async (req, res) => {
  const { email, password, name, shopName, location, contactNumber } = req.body;

  if (!email || !password || !name || !shopName || !location || !contactNumber) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if seller exists
  const sellerExists = await Seller.findOne({ email });
  if (sellerExists) {
    res.status(400);
    throw new Error('Seller already exists');
  }

  // Create seller
  const seller = await Seller.create({
    email,
    password,
    name,
    shopName,
    location,
    contactNumber
  });

  if (seller) {
    res.status(201).json({
      _id: seller.id,
      email: seller.email,
      role: seller.role,
      token: generateToken(seller._id, seller.role)
    });
  } else {
    res.status(400);
    throw new Error('Invalid seller data');
  }
});

// @desc    Authenticate user (customer or seller)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  // Check for user based on role
  const user = role === 'seller' 
    ? await Seller.findOne({ email }) 
    : await Customer.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id, user.role)
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// Generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  registerCustomer,
  registerSeller,
  loginUser
};
