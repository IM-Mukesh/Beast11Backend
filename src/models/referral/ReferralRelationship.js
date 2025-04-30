const mongoose = require('mongoose');

const referralRelationshipSchema = new mongoose.Schema({
    referrerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    referredId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    codeUsed: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    },
    rewardStatus: {
        type: String,
        enum: ['pending', 'credited', 'failed'],
        default: 'pending'
    }
});

// Indexes for faster queries
referralRelationshipSchema.index({ referrerId: 1 });
referralRelationshipSchema.index({ referredId: 1 });
referralRelationshipSchema.index({ status: 1 });
referralRelationshipSchema.index({ codeUsed: 1 });

module.exports = mongoose.model('ReferralRelationship', referralRelationshipSchema); 