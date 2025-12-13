
const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    token: { type: String, required: true, index: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true},
    expiresAt: Date,
    createdAt: { type: Date, default: Date.now},
    revokedAt: Date,
    replacedByToken: String,
    ip: String,
    userAgent: String
});

module.exports = mongoose.model('RefershToken', Schema)