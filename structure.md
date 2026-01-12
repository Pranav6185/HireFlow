Root Structure

campus-hiring-platform/
├── client/                 # React frontend
├── server/                 # Node.js/Express backend
├── .gitignore
├── README.md
└── package.json           # Root package.json for workspace management


Frontend Structure (client/)

client/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── assets/            # Images, logos, static files
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Shared components (buttons, forms, modals)
│   │   ├── student/       # Student-specific components
│   │   ├── college/       # College/TPO-specific components
│   │   └── company/       # Company-specific components
│   ├── pages/             # Page-level components
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── student/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── DrivesList.jsx
│   │   │   ├── DriveDetail.jsx
│   │   │   └── ApplicationStatus.jsx
│   │   ├── college/
│   │   │   ├── TPODashboard.jsx
│   │   │   ├── StudentManagement.jsx
│   │   │   ├── DriveParticipation.jsx
│   │   │   └── PlacementRecords.jsx
│   │   └── company/
│   │       ├── CompanyDashboard.jsx
│   │       ├── CreateDrive.jsx
│   │       ├── ApplicantScreening.jsx
│   │       └── OfferManagement.jsx
│   ├── context/           # React Context API for state
│   │   ├── AuthContext.jsx
│   │   └── NotificationContext.jsx
│   ├── services/          # API service calls
│   │   ├── authService.js
│   │   ├── studentService.js
│   │   ├── collegeService.js
│   │   ├── companyService.js
│   │   └── apiClient.js   # Axios instance with interceptors
│   ├── utils/             # Helper functions
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── constants.js
│   ├── routes/            # Route configuration
│   │   ├── ProtectedRoute.jsx
│   │   └── AppRoutes.jsx
│   ├── App.jsx
│   ├── index.jsx
│   └── index.css
├── package.json
└── .env                   # Environment variables (API URL, etc.)

Backend Structure (server/)

server/
├── src/
│   ├── config/
│   │   ├── db.js          # MongoDB connection
│   │   ├── cloudinary.js  # Cloudinary configuration
│   │   └── email.js       # Nodemailer SMTP setup
│   ├── models/            # Mongoose schemas
│   │   ├── User.js        # Base user model with role discrimination
│   │   ├── Student.js
│   │   ├── College.js
│   │   ├── Company.js
│   │   ├── Drive.js
│   │   ├── DriveCollege.js
│   │   ├── Application.js
│   │   ├── Round.js
│   │   ├── RoundDecision.js
│   │   ├── Offer.js
│   │   ├── PlacementRecord.js
│   │   └── Notification.js
│   ├── controllers/       # Request handlers
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── collegeController.js
│   │   ├── companyController.js
│   │   ├── driveController.js
│   │   ├── applicationController.js
│   │   ├── roundController.js
│   │   ├── offerController.js
│   │   ├── notificationController.js
│   │   └── placementController.js
│   ├── routes/            # API endpoints
│   │   ├── auth.js
│   │   ├── student.js
│   │   ├── college.js
│   │   ├── company.js
│   │   ├── drive.js
│   │   ├── application.js
│   │   ├── round.js
│   │   ├── offer.js
│   │   ├── notification.js
│   │   └── placement.js
│   ├── middleware/
│   │   ├── auth.js        # JWT verification
│   │   ├── rbac.js        # Role-based access control
│   │   ├── validation.js  # Request validation
│   │   ├── upload.js      # Multer/Cloudinary upload handling
│   │   └── errorHandler.js
│   ├── services/          # Business logic layer
│   │   ├── emailService.js        # Email templates & sending
│   │   ├── notificationService.js # In-app notifications
│   │   ├── documentService.js     # Cloudinary operations
│   │   ├── pipelineService.js     # Application state transitions
│   │   └── exportService.js       # Excel/PDF generation
│   ├── utils/
│   │   ├── validators.js
│   │   ├── constants.js   # Status enums, role types
│   │   ├── logger.js      # Winston/Morgan logging
│   │   └── helpers.js
│   ├── events/            # Event emitters for notifications
│   │   ├── driveEvents.js
│   │   ├── roundEvents.js
│   │   └── offerEvents.js
│   └── app.js             # Express app setup
├── server.js              # Entry point
├── package.json
└── .env                   # DB URI, JWT secrets, SMTP, Cloudinary keys
