const emailSubscriptionRepo = require('email-subscription/repositories/email-subscription.repository');

exports.emailSubscripe = async (req) => {
    try {
        const emailSubscription = await emailSubscriptionRepo.save(req.body);
        return { status: 200, data: emailSubscription, message: 'Email Subscription fetched Successfully' };
    } catch (error) {
        return { "success": false, "status": 500, data: [], "message": 'Something went wrong' }
    }
};