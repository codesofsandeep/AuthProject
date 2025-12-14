// controllers/admin.controller.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
    try {
        const { email, password, roles } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(409).json({ message: 'User already exists' });

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await User.create({
            email,
            passwordHash,
            roles: roles && roles.length ? roles : ['user']
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                email: user.email,
                roles: user.roles
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create user' });
    }
};
