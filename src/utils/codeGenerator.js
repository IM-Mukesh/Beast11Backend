const ReferralCode = require('../models/referral/ReferralCode');

/**
 * Generates a unique referral code
 * @returns {Promise<string>} A unique referral code
 */
async function generateUniqueCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const codeLength = 8;
    let code;
    let isUnique = false;

    while (!isUnique) {
        // Generate random code
        code = '';
        for (let i = 0; i < codeLength; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        // Check if code already exists
        const existingCode = await ReferralCode.findOne({ code });
        if (!existingCode) {
            isUnique = true;
        }
    }

    return code;
}

module.exports = {
    generateUniqueCode
}; 