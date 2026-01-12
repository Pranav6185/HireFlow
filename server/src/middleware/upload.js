const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary storage for resumes
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hireflow/resumes',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
    public_id: (req, file) => {
      // Generate unique filename: student-{userId}-{timestamp}
      return `student-${req.user._id}-${Date.now()}`;
    },
  },
});

// Configure Cloudinary storage for brochures and offer letters
const documentStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hireflow/documents',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
    public_id: (req, file) => {
      const type = req.path.includes('brochure') ? 'brochure' : 'offer';
      return `${type}-${req.params.driveId || req.user._id}-${Date.now()}`;
    },
  },
});

// File filter for PDF only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

// Multer configurations
const upload = multer({
  storage: resumeStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const uploadDocument = multer({
  storage: documentStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for documents
  },
});

module.exports = upload;
module.exports.uploadDocument = uploadDocument;

