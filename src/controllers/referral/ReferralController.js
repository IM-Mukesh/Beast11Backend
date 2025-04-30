const ReferralService = require('../../services/referral/ReferralService');
const { validateReferralCode } = require('../../validators/referralValidator');

class ReferralController {
    // Generate a new referral code
    async generateCode(req, res) {
        try {
            const { userId } = req.user; // From auth middleware
            const { validityDays, usageLimit } = req.body;

            const referralCode = await ReferralService.generateReferralCode(userId, {
                validityDays,
                usageLimit
            });

            res.status(201).json({
                success: true,
                data: referralCode
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Apply a referral code
    async applyCode(req, res) {
        try {
            const { code } = req.body;
            const { userId } = req.user; // From auth middleware

            // Validate referral code format
            const validationError = validateReferralCode(code);
            if (validationError) {
                return res.status(400).json({
                    success: false,
                    error: validationError
                });
            }

            const relationship = await ReferralService.processReferralCode(code, userId);

            res.status(200).json({
                success: true,
                data: relationship
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get user's referral statistics
    async getStats(req, res) {
        try {
            const { userId } = req.user; // From auth middleware
            const stats = await ReferralService.getUserReferralStats(userId);

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get user's active referral codes
    async getCodes(req, res) {
        try {
            const { userId } = req.user; // From auth middleware
            const codes = await ReferralService.getUserReferralCodes(userId);

            res.status(200).json({
                success: true,
                data: codes
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    // Process rewards for completed referrals (admin only)
    async processRewards(req, res) {
        try {
            const { relationshipId } = req.params;
            const relationship = await ReferralService.processRewards(relationshipId);

            res.status(200).json({
                success: true,
                data: relationship
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new ReferralController(); 