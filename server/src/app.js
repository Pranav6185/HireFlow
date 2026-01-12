const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const driveRoutes = require('./routes/drive');
const applicationRoutes = require('./routes/application');
const collegeRoutes = require('./routes/college');
const placementRoutes = require('./routes/placement');
const companyRoutes = require('./routes/company');
const notificationRoutes = require('./routes/notification');
const roundRoutes = require('./routes/round');
const companyRoutes = require('./routes/company');
const collegeRoutes = require('./routes/college');
const placementRoutes = require('./routes/placement');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/college', collegeRoutes);
app.use('/api/placement', placementRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/rounds', roundRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/college', collegeRoutes);
app.use('/api/placement', placementRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'HireFlow API is running' });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;

