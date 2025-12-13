const jwt = require('jsonwebtoken');

/**
 * Verify access token
 */
function authenticate(req, res, next) {
    const header = req.get('Authorization') || '';
    const [type, token] = header.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Missing access token' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        req.user = {
            id: payload.sub,
            roles: payload.roles || []
        };

        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

/**
 * Role-based access control
 */
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthenticated' });
        }

        const hasRole = req.user.roles.some(role =>
            roles.includes(role)
        );

        if (!hasRole) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        next();
    };
}

module.exports = { authenticate, requireRole };
