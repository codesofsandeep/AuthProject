// routes/protected.routes.js
const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');
const { getProtectedData } = require('../contollers/protected.controller');
const User = require('../models/User');

// User profile
router.get('/profile', verifyToken, async (req, res) => {
    const user = await User.findById(req.user.sub).select('-passwordHash');
    res.json(user);
});

// Admin-only protected route
router.get('/protected', verifyToken, requireRole('admin'), getProtectedData);

module.exports = router;
