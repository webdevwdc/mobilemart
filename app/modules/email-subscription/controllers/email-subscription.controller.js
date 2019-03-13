const { join } = require('path');
const { promisify } = require('util');
const { readFile } = require('fs');
const ejs = require('ejs');

const emailSubscriptionRepo = require('email-subscription/repositories/email-subscription.repository');

const readFileAsync = promisify(readFile);

exports.sendEmailToAll = async () => {
    try {
        const activeEmailsMetadata = await emailSubscriptionRepo.getActiveEmails();
        const getActiveEmails = _.pluck(activeEmailsMetadata, 'email');
        const ejsTemplate = await readFileAsync(join(__dirname, '../../..', 'views/templates/email.subscription.ejs'));
        const html = ejs.render(ejsTemplate.toString(), {});
     
        await transporter.sendMail({
            from: `Admin<${process.env.MAIL_USERNAME}>`,
            to: getActiveEmails,
            subject: 'Reset Password | Carpool',
            html: html
        });
        return { "success": false, "status": 200, data: [], "message": 'Email sends successfully' }
    } catch (error) {
        return { "success": false, "status": 500, data: error, "message": 'Something went wrong' }
    }
};