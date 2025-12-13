const express = require('express');
const router = express.Router();
const { authenticate, requireRole } = require('../middleware/auth');
const User = require('../models/User');

/**
 * Logged-in user profile
 */
router.get('/profile', authenticate, async (req, res) => {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.json(user);
});

/**
 * Admin-only route
 */
router.get(
    '/admin',
    authenticate,
    requireRole('admin'),
    (req, res) => {
        res.json({ message: 'Welcome Admin 🚀' });
    }
);

module.exports = router;
