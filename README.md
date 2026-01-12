# HireFlow - Campus Hiring & Internship Management Platform

A MERN stack prototype for managing campus hiring drives across multiple colleges.

## Project Structure

- `client/` - React frontend application
- `server/` - Node.js/Express backend API

## Tech Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (Access + Refresh tokens)
- **File Storage**: Cloudinary
- **Email**: Nodemailer (SMTP)

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)
- Cloudinary account (for document storage)

### Installation

1. Install root dependencies:
```bash
npm install
```

2. Install client dependencies:
```bash
cd client
npm install
```

3. Install server dependencies:
```bash
cd server
npm install
```

### Environment Setup

1. Create `server/.env`:
```
MONGODB_URI=mongodb://localhost:27017/hireflow
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
PORT=5000
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

2. Create `client/.env`:
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

1. Start MongoDB (if running locally)

2. Start the server:
```bash
cd server
npm run dev
```

3. Start the client (in a new terminal):
```bash
cd client
npm start
```

## Development Phases

- **Phase 1**: Student Module (Current)
- **Phase 2**: College Module
- **Phase 3**: Company Module
- **Phase 4**: Integration & Pipeline
- **Phase 5**: Notifications + Documents
- **Phase 6**: Testing & Stabilization

## License

MIT

