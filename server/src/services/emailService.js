const { getTransporter } = require('../config/email');
const Notification = require('../models/Notification');
const User = require('../models/User');

const isEmailEnabled = () => {
  return !!process.env.SMTP_HOST && process.env.EMAIL_ENABLED !== 'false';
};

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn('Email disabled (no transporter). Skipping send.');
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'noreply@hireflow.local',
    to,
    subject,
    text,
    html: html || text,
  });
};

const createNotification = async ({ userId, title, message, type = 'informational' }) => {
  await Notification.create({
    userId,
    title,
    message,
    type,
    channel: 'in-app',
    deliveryStatus: 'sent',
  });
};

// Helper to notify a user by email + in-app (best-effort)
const notifyUser = async ({ userId, subject, text, html, type = 'informational' }) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    if (isEmailEnabled()) {
      await sendEmail({
        to: user.email,
        subject,
        text,
        html,
      });
    }

    await createNotification({
      userId: user._id,
      title: subject,
      message: text,
      type,
    });
  } catch (err) {
    console.error('Failed to notify user:', err.message);
  }
};

// Domain-specific helpers
const notifyShortlist = async ({ userId, driveRole, companyName }) => {
  const subject = `You have been shortlisted for ${driveRole} at ${companyName}`;
  const text = `Congrats! You have been shortlisted for the ${driveRole} role at ${companyName}. Please check your HireFlow dashboard for next steps.`;
  await notifyUser({ userId, subject, text, type: 'critical' });
};

const notifyRoundSchedule = async ({ userId, driveRole, companyName, roundTitle, schedule }) => {
  const subject = `Round scheduled: ${roundTitle} for ${driveRole} at ${companyName}`;
  const parts = [];
  if (schedule.date) parts.push(`Date: ${new Date(schedule.date).toLocaleString()}`);
  if (schedule.venue) parts.push(`Venue: ${schedule.venue}`);
  if (schedule.link) parts.push(`Link: ${schedule.link}`);
  const details = parts.join('\n');
  const text = `A round has been scheduled for the ${driveRole} role at ${companyName}.\nRound: ${roundTitle}\n${details}\n\nPlease check HireFlow for more details.`;
  await notifyUser({ userId, subject, text, type: 'critical' });
};

const notifyOfferIssued = async ({ userId, driveRole, companyName }) => {
  const subject = `Offer issued for ${driveRole} at ${companyName}`;
  const text = `Good news! An offer has been issued for the ${driveRole} role at ${companyName}. Please log in to HireFlow to review and acknowledge your offer.`;
  await notifyUser({ userId, subject, text, type: 'critical' });
};

const notifyOfferAcknowledged = async ({ userId, driveRole, companyName }) => {
  const subject = `Offer acknowledged for ${driveRole} at ${companyName}`;
  const text = `Your acknowledgement for the ${driveRole} offer at ${companyName} has been recorded. The TPO and company will be notified.`;
  await notifyUser({ userId, subject, text, type: 'informational' });
};

module.exports = {
  sendEmail,
  notifyUser,
  notifyShortlist,
  notifyRoundSchedule,
  notifyOfferIssued,
  notifyOfferAcknowledged,
};


