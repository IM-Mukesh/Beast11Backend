const mongoose = require('mongoose');

const referralCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        default: 1
    },
    usageCount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        default: 'active'
    }
});

// Index for faster queries
referralCodeSchema.index({ code: 1 });
referralCodeSchema.index({ userId: 1 });
referralCodeSchema.index({ status: 1 });

module.exports = mongoose.model('ReferralCode', referralCodeSchema); 