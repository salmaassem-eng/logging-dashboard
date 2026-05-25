// backend/src/routes/user.js
import express from 'express';
import { register, login, logout } from '../controllers/user.js';

const router = express.Router();

// Register a new developer (public)
router.post('/register', register);

// Login existing developer (public)
router.post('/login', login);

// Logout developer (requires JWT but can be called anytime)
router.post('/logout', logout);

export default router;
