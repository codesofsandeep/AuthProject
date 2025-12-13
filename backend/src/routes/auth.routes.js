const express = require('express');
const router = express.Router();
const { login, register, refresh, logout } = require('../contollers/auth.controller');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

//POST /api/auth/refresh
router.post('/refresh', refresh)

// POST /api/auth/logout
router.post('/logout', logout)

module.exports = router;
