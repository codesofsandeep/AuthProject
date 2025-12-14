// const express = require('express');
// const router = express.Router();
// const { login, register, refresh, logout } = require('../contollers/auth.controller');
// const { createUser } = require('../contollers/admin.controller');

// const { verifyToken, requireRole } = require('../middleware/auth');


// // POST /api/auth/register
// router.post('/register', register);

// // POST /api/auth/login
// router.post('/login', login);

// //POST /api/auth/refresh
// router.post('/refresh', refresh)

// // POST /api/auth/logout
// router.post('/logout', logout)

// router.post(
//     '/create-user',
//     verifyToken,           // must be logged in
//     requireRole('admin'),  // must be admin
//     createUser
// );

// module.exports = router;


const express = require('express');
const router = express.Router();
const { login, register, refresh, logout } = require('../contollers/auth.controller');
const { createUser } = require('../contollers/admin.controller');
const { verifyToken, requireRole } = require('../middleware/auth');

// Auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Admin-only route
router.post('/create-user', verifyToken, requireRole('admin'), createUser);

module.exports = router;
