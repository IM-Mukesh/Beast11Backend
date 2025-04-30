const express = require('express');
const router = express.Router();
const ReferralController = require('../../controllers/referral/ReferralController');
const { authenticate } = require('../../middleware/auth');
const { isAdmin } = require('../../middleware/roleCheck');

// Generate a new referral code
router.post('/generate', authenticate, ReferralController.generateCode);

// Apply a referral code
router.post('/apply', authenticate, ReferralController.applyCode);

// Get user's referral statistics
router.get('/stats', authenticate, ReferralController.getStats);

// Get user's active referral codes
router.get('/codes', authenticate, ReferralController.getCodes);

// Process rewards for completed referrals (admin only)
router.post('/process-rewards/:relationshipId', authenticate, isAdmin, ReferralController.processRewards);

module.exports = router; 