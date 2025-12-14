// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// /**
//  * Verify access token
//  */
// function authenticate(req, res, next) {
//     const header = req.get('Authorization') || '';
//     const [type, token] = header.split(' ');

//     if (type !== 'Bearer' || !token) {
//         return res.status(401).json({ message: 'Missing access token' });
//     }

//     try {
//         const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

//         req.user = {
//             id: payload.sub,
//             roles: payload.roles || []
//         };

//         next();
//     } catch (err) {
//         return res.status(401).json({ message: 'Invalid or expired token' });
//     }
// }

// /**
//  * Role-based access control
//  */
// function requireRole(...roles) {
//     return (req, res, next) => {
//         if (!req.user) {
//             return res.status(401).json({ message: 'Unauthenticated' });
//         }

//         const hasRole = req.user.roles.some(role =>
//             roles.includes(role)
//         );

//         if (!hasRole) {
//             return res.status(403).json({ message: 'Forbidden' });
//         }

//         next();
//     };
// }

// module.exports = { authenticate, requireRole };



// exports.authenticateToken = async (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (!token) return res.sendStatus(401);

//     try {
//         const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
//         const user = await User.findById(payload.sub);
//         if (!user) return res.sendStatus(401);

//         req.user = user; // attach user to request
//         next();
//     } catch (err) {
//         console.error(err);
//         res.sendStatus(403);
//     }
// };

// exports.requireAdmin = (req, res, next) => {
//     if (!req.user.roles.includes('admin')) return res.sendStatus(403);
//     next();
// };


// exports.verifyToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (!token) return res.sendStatus(401);

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403);
//         req.user = user;
//         next();
//     });
// };

// exports.requireRole = (role) => (req, res, next) => {
//     if (!req.user.roles.includes(role)) return res.sendStatus(403);
//     next();
// };


const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verify access token
 */
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, payload) => {
        if (err) return res.sendStatus(403);
        req.user = payload; // attach decoded token
        next();
    });
}

/**
 * Role-based access control
 */
function requireRole(role) {
    return (req, res, next) => {
        if (!req.user?.roles?.includes(role)) return res.sendStatus(403);
        next();
    };
}

module.exports = { verifyToken, requireRole };
