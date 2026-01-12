const express = require('express');
const { body } = require('express-validator');
const authenticate = require('../middleware/auth');
const rbac = require('../middleware/rbac');
const Drive = require('../models/Drive');
const Application = require('../models/Application');
const { notifyRoundSchedule } = require('../services/emailService');

const router = express.Router();

// Company schedules a round for a drive
router.post(
  '/schedule',
  authenticate,
  rbac('company'),
  [
    body('driveId').notEmpty(),
    body('roundIndex').isInt({ min: 0 }),
    body('date').optional().isISO8601(),
    body('venue').optional().isString(),
    body('link').optional().isString(),
    body('mode').optional().isIn(['online', 'offline', 'hybrid']),
  ],
  async (req, res, next) => {
    try {
      const { driveId, roundIndex, date, venue, link, mode } = req.body;

      const drive = await Drive.findById(driveId).populate(
        'companyId',
        'name domain'
      );

      if (!drive) {
        return res.status(404).json({ message: 'Drive not found' });
      }

      const round = drive.roundStructure[roundIndex];
      if (!round) {
        return res
          .status(400)
          .json({ message: 'Invalid roundIndex for this drive' });
      }

      const schedulingInfo = {
        ...round.schedulingInfo,
        ...(date && { date }),
        ...(venue && { venue }),
        ...(link && { link }),
        ...(mode && { mode }),
      };

      drive.roundStructure[roundIndex].schedulingInfo = schedulingInfo;
      await drive.save();

      // Notify all applicants for this drive (best-effort)
      const applications = await Application.find({ driveId: drive._id }).select(
        'studentId'
      );

      const notified = new Set();
      for (const app of applications) {
        const key = String(app.studentId);
        if (notified.has(key)) continue;
        notified.add(key);

        await notifyRoundSchedule({
          userId: app.studentId,
          driveRole: drive.role,
          companyName: drive.companyId?.name || '',
          roundTitle: round.title,
          schedule: schedulingInfo,
        });
      }

      res.json({
        message: 'Round scheduled successfully',
        schedulingInfo,
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;


