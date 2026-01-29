const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { name, email, password, voterId, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { voterId: voterId.toUpperCase() },
        { phone }
      ]
    });

    if (existingUser) {
      let message = 'User already exists';
      if (existingUser.email === email.toLowerCase()) message = 'Email already registered';
      if (existingUser.voterId === voterId.toUpperCase()) message = 'Voter ID already registered';
      if (existingUser.phone === phone) message = 'Phone number already registered';

      return res.status(400).json({
        success: false,
        message
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      voterId: voterId.toUpperCase(),
      phone
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          voterId: user.voterId,
          phone: user.phone,
          isAdmin: user.isAdmin,
          hasVoted: user.hasVoted
        }
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if admin login attempt
    if (req.path.includes('/admin/login') && !user.isAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized as admin'
      });
    }

    // Check if regular login attempt by admin
    if (!req.path.includes('/admin/login') && user.isAdmin) {
      return res.status(401).json({
        success: false,
        message: 'Admin must use admin login'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          voterId: user.voterId,
          phone: user.phone,
          isAdmin: user.isAdmin,
          hasVoted: user.hasVoted
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          voterId: user.voterId,
          phone: user.phone,
          isAdmin: user.isAdmin,
          hasVoted: user.hasVoted
        }
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

// @desc    Request phone verification
// @route   POST /api/auth/request-phone-verification
// @access  Public
const requestPhoneVerification = async (req, res) => {
  try {
    const { phone } = req.body;

    // In a real app, you would integrate with SMS service like Twilio
    // For now, we'll simulate this
    console.log(`Phone verification requested for: ${phone}`);

    res.json({
      success: true,
      message: 'Verification code sent to phone'
    });
  } catch (error) {
    console.error('Request phone verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Verify phone number
// @route   POST /api/auth/verify-phone
// @access  Public
const verifyPhone = async (req, res) => {
  try {
    const { phone, code } = req.body;

    // In a real app, you would verify the code
    // For now, we'll accept any 6-digit code
    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Update user phone verification status
    const user = await User.findOneAndUpdate(
      { phone },
      { phoneVerified: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Phone verified successfully'
    });
  } catch (error) {
    console.error('Verify phone error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // In a real app, you would send a reset email
    // For now, we'll just return success
    console.log(`Password reset requested for: ${email}`);

    res.json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  logout,
  requestPhoneVerification,
  verifyPhone,
  resetPassword
};
