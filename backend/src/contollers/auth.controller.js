const bcrypt = require('bcryptjs');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { signAccess, signRefresh, hashToken } = require('../utils/tokens');
const jwt = require('jsonwebtoken');

// Login 
// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         const valid = await bcrypt.compare(password, user.passwordHash);
//         if (!valid) {
//             return res.status(401).json({ message: 'Invalid credentials' });
//         }

//         const accessToken = signAccess({
//             sub: user._id.toString(),
//             roles: user.roles
//         });

//         const refreshToken = signRefresh({
//             sub: user._id.toString()
//         });

//         await RefreshToken.create({
//             token: hashToken(refreshToken),
//             user: user._id,
//             expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//             ip: req.ip,
//             userAgent: req.get('User-Agent')
//         });

//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             sameSite: 'lax',
//             secure: false,
//             path: '/',
//             maxAge: 30 * 24 * 60 * 60 * 1000
//         });

//         res.json({
//             accessToken,
//             user: {
//                 id: user._id,
//                 email: user.email,
//                 roles: user.roles
//             }
//         });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Login failed' });
//     }
// };

// LOGIN
// exports.login = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ email });
//         if (!user) return res.status(401).json({ message: 'Invalid credentials' });

//         const valid = await bcrypt.compare(password, user.passwordHash);
//         if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

//         // Generate tokens
//         const accessToken = signAccess({ sub: user._id.toString(), roles: user.roles });
//         const refreshToken = signRefresh({ sub: user._id.toString() });

//         // Store hashed refresh token
//         await RefreshToken.create({
//             token: hashToken(refreshToken),
//             user: user._id,
//             expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//             ip: req.ip,
//             userAgent: req.get('User-Agent')
//         });

//         // Send cookie (path must be '/'!)
//         res.cookie('refreshToken', refreshToken, {
//             httpOnly: true,
//             secure: false, // true in prod (https)
//             sameSite: 'lax',
//             path: '/',
//             maxAge: 30 * 24 * 60 * 60 * 1000
//         });

//         res.json({ accessToken, user: { id: user._id, email: user.email, roles: user.roles } });

//     } catch (err) {
//         console.error('Login error:', err);
//         res.status(500).json({ message: 'Login failed' });
//     }
// };

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

        // Generate tokens
        const accessToken = signAccess({ sub: user._id.toString(), roles: user.roles });
        const refreshToken = signRefresh({ sub: user._id.toString() });

        // Store hashed refresh token in DB
        await RefreshToken.create({
            token: hashToken(refreshToken),
            user: user._id,
            expiresAt: new Date(Date.now() + 30*24*60*60*1000), // 30 days
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });

        // Send refresh token as HttpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,          // false on localhost, true in production with HTTPS
            sameSite: 'none',       // important for cross-origin
            path: '/',
            maxAge: 30*24*60*60*1000
        });

        // Send access token in response
        res.json({
            accessToken,
            user: { id: user._id, email: user.email, roles: user.roles }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Login failed' });
    }
};



// Register

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // 3. Hash password
        const passwordHash = await bcrypt.hash(
            password,
            Number(process.env.BCRYPT_ROUNDS) || 12
        );

        // 4. Create user
        await User.create({
            email,
            passwordHash,
            roles: ['user']
        });

        // 5. Send response
        res.status(201).json({
            message: 'User registered successfully'
        });

    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ message: 'Registration failed' });
    }
};

// Logout

exports.logout = async (req, res) => {
    try {
        const tokenFromCookie = req.cookies.refreshToken;
        if (!tokenFromCookie) {
            return res.sendStatus(204);
        }

        const hashed = hashToken(tokenFromCookie);

        await RefreshToken.findOneAndUpdate(
            { token: hashed },
            { revokedAt: new Date() }
        );

        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });

        res.json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ message: 'Logout failed' });
    }
};


// Refresh Token

// exports.refresh = async (req, res) => {
//     try {
//         const tokenFromCookie = req.cookies.refreshToken;
//         if (!tokenFromCookie) {
//             return res.status(401).json({ message: 'No refresh token' });
//         }

//         // Verify refresh JWT
//         let payload;
//         try {
//             payload = jwt.verify(tokenFromCookie, process.env.JWT_REFRESH_SECRET);
//         } catch {
//             return res.status(401).json({ message: 'Invalid refresh token' });
//         }

//         const hashedToken = hashToken(tokenFromCookie);

//         //  Find token in DB
//         const storedToken = await RefreshToken.findOne({ token: hashedToken });

//         // TOKEN REUSE DETECTED
//         if (!storedToken || storedToken.revokedAt) {
//             // Probable theft → revoke all tokens of user
//             await RefreshToken.updateMany(
//                 { user: payload.sub },
//                 { revokedAt: new Date() }
//             );

//             return res.status(401).json({
//                 message: 'Token reuse detected. All sessions revoked.'
//             });
//         }

//         // Fetch user from DB to get roles
//         const user = await User.findById(payload.sub);
//         if (!user) return res.status(401).json({ message: 'User not found' });

//         // Generate NEW tokens
//         const newAccessToken = signAccess({
//             sub: user._id.toString(),
//             roles: user.roles
//         });


//         const newRefreshToken = signRefresh({
//             sub: payload.sub
//         });

//         const newHashed = hashToken(newRefreshToken);

//         //  Rotate token
//         storedToken.revokedAt = new Date();
//         storedToken.replacedByToken = newHashed;
//         await storedToken.save();

//         await RefreshToken.create({
//             token: newHashed,
//             user: payload.sub,
//             expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//             ip: req.ip,
//             userAgent: req.get('User-Agent')
//         });

//         //  Set new cookie
//         res.cookie('refreshToken', newRefreshToken, {
//             httpOnly: true,
//             sameSite: 'lax',
//             secure: false,
//             path: '/',
//             maxAge: 30 * 24 * 60 * 60 * 1000
//         });

//         res.json({ accessToken: newAccessToken });
//         console.log('Cookies:', req.cookies);
//         // const tokenFromCookie = req.cookies.refreshToken;
//         if (!tokenFromCookie) {
//             console.log('No refresh token cookie received!');
//             return res.status(401).json({ message: 'No refresh token' });
//         }


//     } catch (err) {
//         console.error('Refresh error:', err);
//         res.status(500).json({ message: 'Refresh failed' });
//     }
// };

// exports.refresh = async (req, res) => {
//     try {
//         const tokenFromCookie = req.cookies.refreshToken;
//         console.log('Cookies received on refresh:', req.cookies);

//         if (!tokenFromCookie) return res.status(401).json({ message: 'No refresh token' });

//         // Verify refresh JWT
//         let payload;
//         try {
//             payload = jwt.verify(tokenFromCookie, process.env.JWT_REFRESH_SECRET);
//         } catch (err) {
//             console.log('JWT verify error:', err.message);
//             return res.status(401).json({ message: 'Invalid refresh token' });
//         }

//         const hashedToken = hashToken(tokenFromCookie);

//         const storedToken = await RefreshToken.findOne({ token: hashedToken });

//         if (!storedToken || storedToken.revokedAt) {
//             // Invalidate all tokens of this user
//             await RefreshToken.updateMany({ user: payload.sub }, { revokedAt: new Date() });
//             return res.status(401).json({ message: 'Token reuse detected. All sessions revoked.' });
//         }

//         const user = await User.findById(payload.sub);
//         if (!user) return res.status(401).json({ message: 'User not found' });

//         // Generate new tokens
//         const newAccessToken = signAccess({ sub: user._id.toString(), roles: user.roles });
//         const newRefreshToken = signRefresh({ sub: user._id.toString() });

//         // Rotate token
//         storedToken.revokedAt = new Date();
//         storedToken.replacedByToken = hashToken(newRefreshToken);
//         await storedToken.save();

//         await RefreshToken.create({
//             token: hashToken(newRefreshToken),
//             user: user._id,
//             expiresAt: new Date(Date.now() + 30*24*60*60*1000),
//             ip: req.ip,
//             userAgent: req.get('User-Agent')
//         });

//         // Set cookie
//         res.cookie('refreshToken', newRefreshToken, {
//             httpOnly: true,
//             secure: false,
//             sameSite: 'lax',
//             path: '/',
//             maxAge: 30*24*60*60*1000
//         });

//         res.json({ accessToken: newAccessToken });

//     } catch (err) {
//         console.error('Refresh error:', err);
//         res.status(500).json({ message: 'Refresh failed' });
//     }
// };


exports.refresh = async (req, res) => {
    try {
        const tokenFromCookie = req.cookies.refreshToken;

        console.log('Cookies received on refresh:', req.cookies);

        if (!tokenFromCookie)
            return res.status(401).json({ message: 'No refresh token sent' });

        let payload;
        try {
            payload = jwt.verify(tokenFromCookie, process.env.JWT_REFRESH_SECRET);
        } catch (err) {
            console.error('JWT verify failed:', err.message);
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const hashedToken = hashToken(tokenFromCookie);
        const storedToken = await RefreshToken.findOne({ token: hashedToken });

        if (!storedToken || storedToken.revokedAt) {
            await RefreshToken.updateMany({ user: payload.sub }, { revokedAt: new Date() });
            return res.status(401).json({ message: 'Token reuse detected' });
        }

        const user = await User.findById(payload.sub);
        if (!user) return res.status(401).json({ message: 'User not found' });

        // Generate new tokens
        const newAccessToken = signAccess({ sub: user._id.toString(), roles: user.roles });
        const newRefreshToken = signRefresh({ sub: user._id.toString() });

        // Rotate refresh token
        storedToken.revokedAt = new Date();
        storedToken.replacedByToken = hashToken(newRefreshToken);
        await storedToken.save();

        await RefreshToken.create({
            token: hashToken(newRefreshToken),
            user: user._id,
            expiresAt: new Date(Date.now() + 30*24*60*60*1000),
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });

        // Set new refresh token cookie
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',       // must match login
            path: '/',
            maxAge: 30*24*60*60*1000
        });

        res.json({ accessToken: newAccessToken });

    } catch (err) {
        console.error('Refresh error:', err);
        res.status(500).json({ message: 'Refresh failed' });
    }
};

