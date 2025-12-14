// // const jwt = require('jsonwebtoken');
// // const crypto = require('crypto');

// // const signAccess = (payload) => jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' });
// // const signRefresh = (payload) => jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '30d' });
// // const hashToken = (t) => crypto.createHash('sha256').update(t).digest('hex');

// // module.exports = { signAccess, signRefresh, hashToken };


// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');

// function signAccess(payload) {
//     return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
//         expiresIn: '15m' // access token short life
//     });
// }

// function signRefresh(payload) {
//     return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
//         expiresIn: '30d' // refresh token long life
//     });
// }

// // Hash refresh token for DB storage
// function hashToken(token) {
//     return crypto.createHash('sha256').update(token).digest('hex');
// }

// module.exports = {
//     signAccess,
//     signRefresh,
//     hashToken
// };


const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// ✅ Always generate token from USER OBJECT
function signAccess(user) {
    return jwt.sign(
        {
            sub: user._id.toString(),
            roles: user.roles
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: '15m' }
    );
}

function signRefresh(user) {
    return jwt.sign(
        {
            sub: user._id.toString()
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '30d' }
    );
}

function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {
    signAccess,
    signRefresh,
    hashToken
};
