
const nodemailer = require('nodemailer');
// aws.config.update({
//     accessKeyId: config.AWS_ACCESS_KEY,
//     secretAccessKey:  config.AWS_SECRET_KEY,
// });

// s3 = new aws.S3();

const isProd = process.env.NODE_ENV === 'prod';

module.exports = {
    jwtSecret: "MyS3cr3tK3Y",
    jwtSession: {
        session: false
    },
    PAGINATION_PERPAGE: 10,
    // AWS_BUCKET:'getdrinks',
    // AWS_ACCESS_KEY:'AKIAJBMYOI32PDBXDTRQ',
    // AWS_SECRET_KEY:'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',
    android_serverKey: 'AAAA--U1itk:APA91bHrb92x3pImrnrbEungvULxPJhYLxagXWEs2m-6YpuJacjSrgwqhlTgii-Q-2em6KGfDRdg253cuzy7L7SUqnCNuVwUDY_AQUb707GS1-Pq7HsjDUM-EW5BM6_DsIcZcDdk6hWc',
    ios_key: '/var/www/html2/scope/admin/config/AuthKey_8KB42KAXM8.p8',
    ios_keyId: '7XGMBSUZ7H',
    ios_teamId: 'H23W3EERLK',
    stripe_pub_key: 'pk_test_CbyKB49tW4HK64CWeGhhOKgm',
    stripe_secret_key: 'sk_test_WyhzyGDgDUnAkVqI6yFAVXE6',
    isProd,
    getPort: process.env.PORT || 1380,
    getAdminFolderName: process.env.ADMIN_FOLDER_NAME || 'admin',
    getApiFolderName: process.env.API_FOLDER_NAME || 'api',
    nonSecurePaths: ['/user/login', '/level', '/course', '/user/myprofile'],
    transporter: nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        }
    }),
    // s3: new aws.S3()
}
