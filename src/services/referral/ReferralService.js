const ReferralCode = require('../../models/referral/ReferralCode');
const ReferralRelationship = require('../../models/referral/ReferralRelationship');
const ReferralReward = require('../../models/referral/ReferralReward');
const { generateUniqueCode } = require('../../utils/codeGenerator');
const { addDays } = require('date-fns');

class ReferralService {
    // Generate a new referral code for a user
    async generateReferralCode(userId, options = {}) {
        const code = await generateUniqueCode();
        const expiresAt = addDays(new Date(), options.validityDays || 30);
        
        const referralCode = new ReferralCode({
            code,
            userId,
            expiresAt,
            usageLimit: options.usageLimit || 1
        });

        await referralCode.save();
        return referralCode;
    }

    // Validate and process a referral code
    async processReferralCode(code, referredUserId) {
        const referralCode = await ReferralCode.findOne({ 
            code, 
            status: 'active',
            expiresAt: { $gt: new Date() }
        });

        if (!referralCode) {
            throw new Error('Invalid or expired referral code');
        }

        if (referralCode.usageCount >= referralCode.usageLimit) {
            throw new Error('Referral code usage limit reached');
        }

        // Check if user has already been referred
        const existingRelationship = await ReferralRelationship.findOne({
            referredId: referredUserId
        });

        if (existingRelationship) {
            throw new Error('User has already been referred');
        }

        // Create referral relationship
        const relationship = new ReferralRelationship({
            referrerId: referralCode.userId,
            referredId: referredUserId,
            codeUsed: code
        });

        // Update usage count
        referralCode.usageCount += 1;
        if (referralCode.usageCount >= referralCode.usageLimit) {
            referralCode.status = 'inactive';
        }

        await Promise.all([
            relationship.save(),
            referralCode.save()
        ]);

        return relationship;
    }

    // Process rewards for completed referrals
    async processRewards(relationshipId) {
        const relationship = await ReferralRelationship.findById(relationshipId);
        if (!relationship || relationship.status !== 'pending') {
            throw new Error('Invalid or already processed relationship');
        }

        const reward = await ReferralReward.findOne({ 
            status: 'active',
            expiresAt: { $gt: new Date() }
        });

        if (!reward) {
            throw new Error('No active rewards available');
        }

        // Update relationship status
        relationship.status = 'completed';
        relationship.completedAt = new Date();
        relationship.rewardStatus = 'credited';
        await relationship.save();

        // Process the reward (implement reward distribution logic here)
        // This could involve updating user wallet, creating contest entries, etc.
        await this.distributeReward(relationship.referrerId, reward);

        return relationship;
    }

    // Get referral statistics for a user
    async getUserReferralStats(userId) {
        const [totalReferrals, completedReferrals, pendingReferrals] = await Promise.all([
            ReferralRelationship.countDocuments({ referrerId: userId }),
            ReferralRelationship.countDocuments({ 
                referrerId: userId, 
                status: 'completed' 
            }),
            ReferralRelationship.countDocuments({ 
                referrerId: userId, 
                status: 'pending' 
            })
        ]);

        return {
            totalReferrals,
            completedReferrals,
            pendingReferrals,
            conversionRate: totalReferrals > 0 ? (completedReferrals / totalReferrals) * 100 : 0
        };
    }

    // Get active referral codes for a user
    async getUserReferralCodes(userId) {
        return ReferralCode.find({
            userId,
            status: 'active',
            expiresAt: { $gt: new Date() }
        });
    }

    // Private method to distribute rewards
    async distributeReward(userId, reward) {
        // Implement reward distribution logic based on reward type
        switch (reward.type) {
            case 'bonus_cash':
                // Add bonus cash to user's wallet
                // await walletService.addBonus(userId, reward.amount);
                break;
            case 'contest_entry':
                // Create free contest entry
                // await contestService.createFreeEntry(userId, reward.amount);
                break;
            case 'discount':
                // Apply discount to next purchase
                // await discountService.createDiscount(userId, reward.amount);
                break;
            default:
                throw new Error('Invalid reward type');
        }
    }
}

module.exports = new ReferralService(); 