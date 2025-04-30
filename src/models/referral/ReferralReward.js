const mongoose = require('mongoose');

const referralRewardSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['bonus_cash', 'contest_entry', 'discount'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    conditions: {
        minDeposit: {
            type: Number,
            default: 0
        },
        maxReward: {
            type: Number
        },
        validFor: {
            type: Number, // Duration in days
            required: true
        }
    },
    validityPeriod: {
        type: Number, // Duration in days
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

// Indexes for faster queries
referralRewardSchema.index({ type: 1 });
referralRewardSchema.index({ status: 1 });
referralRewardSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('ReferralReward', referralRewardSchema); 