const nodeMailer = require('nodemailer');
 
exports.sendEmailWithNodemailer = (req, res, emailData) => {
  const transporter = nodeMailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.GMAIL_EMAIL, // GMAIL FOR WHICH YOU GENERATED APP PASSWORD
      pass: process.env.GMAIL_API_KEY, // GMAIL APP PASSWORD WHICH YOU GENERATED EARLIER
    },
    tls: {
      ciphers: 'SSLv3',
    },
  });
 
  return transporter
    .sendMail(emailData)
    .then((info) => {
      console.log(`Email sent: ${info.response}`);
      // TODO message: `Email has been sent to ${emailData.to}. Please follow the instructions inside.`,
      return res.json({
        message: `Email has been sent to ${emailData.to}. Follow the instruction to activate your account`,
      });
    })
    .catch((err) => console.log(`Problem sending email: ${err}`));
};