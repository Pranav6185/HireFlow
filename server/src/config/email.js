const nodemailer = require('nodemailer');

let transporter = null;

const createTransporter = () => {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST) {
    console.warn('SMTP not configured; email sending is disabled');
    return null;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
};

module.exports = {
  getTransporter: createTransporter,
};


