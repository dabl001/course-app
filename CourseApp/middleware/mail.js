const keys = require('../keys');

module.exports = async (nodemailer, email, content) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'abylaydauletkhan@gmail.com',
                pass: keys.APP_PASS,
            },
        });
        const mailOptions = {
            from: 'abylaydauletkhan@gmail.com',
            to: email,
            subject: 'Course Shop',
            html: content,
        };
        await transporter.sendMail(mailOptions);
        console.log('mail sent successfully');
    } catch (error) {
        console.error(error);
    }
};
