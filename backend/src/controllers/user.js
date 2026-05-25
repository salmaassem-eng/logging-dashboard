import jwt from 'jsonwebtoken';
import Developer from '../models/Developer.js';

// Helper to sign JWT and return in response/cookie
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res
    .status(statusCode)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token,
      developer: {
        id: user._id,
        username: user.username,
        email: user.email,
        apiKey: user.apiKey,
        createdAt: user.createdAt,
      },
    });
};

// @desc    Register a new developer
// @route   POST /api/users/register
// @access  Public
export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    const user = await Developer.create({
      username,
      email,
      password,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login developer
// @route   POST /api/users/login
// @access  Public
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password inputs
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password',
    });
  }

  try {
    // Find developer in DB
    const user = await Developer.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    // Verify password match
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password credentials',
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout developer / clear cookie
// @route   POST /api/users/logout
// @access  Private (but can be hit anytime to clear client cache)
export const logout = async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000), // expires in 10s
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Developer successfully logged out',
  });
};
