import nodemailer from 'nodemailer';
import List from '../models/list-schema.js';
import User from '../models/user-schema.js';

export const sendEmail = async (req, res) => {
    try {
        const { listId } = req.params;
        const { subject, body } = req.body;

        const list = await List.findById(listId).populate('users');
        if (!list) return res.status(404).json({ error: 'List not found' });

        let testAccount = await nodemailer.createTestAccount()
        
            let transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false, 
                auth: {
                    user: testAccount.user, 
                    pass: testAccount.pass
                }
            });

        for (const user of list.users) {
            const mailBody = body.replace(/\[(\w+)\]/g, (_, prop) => user.properties.get(prop) || '');
            await transporter.sendMail({
                from: testAccount.user,
                to: user.email,
                subject,
                text: mailBody
            });
        }

        res.status(200).json({ message: 'Emails sent successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};