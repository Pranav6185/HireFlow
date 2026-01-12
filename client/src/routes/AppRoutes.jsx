import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import StudentDashboard from '../pages/student/Dashboard';
import StudentProfile from '../pages/student/Profile';
import DrivesList from '../pages/student/DrivesList';
import DriveDetail from '../pages/student/DriveDetail';
import ApplicationStatus from '../pages/student/ApplicationStatus';
import TPODashboard from '../pages/college/TPODashboard';
import StudentManagement from '../pages/college/StudentManagement';
import DriveParticipation from '../pages/college/DriveParticipation';
import PlacementRecords from '../pages/college/PlacementRecords';
import CompanyDashboard from '../pages/company/CompanyDashboard';
import CreateDrive from '../pages/company/CreateDrive';
import ApplicantScreening from '../pages/company/ApplicantScreening';
import OfferManagement from '../pages/company/OfferManagement';
import { useAuth } from '../context/AuthContext';

const HomeRedirect = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'college') {
    return <Navigate to="/college/dashboard" replace />;
  }

  if (user.role === 'company') {
    return <Navigate to="/company/dashboard" replace />;
  }

  // default: student
  return <Navigate to="/student/dashboard" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/drives"
        element={
          <ProtectedRoute requiredRole="student">
            <DrivesList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/drives/:driveId"
        element={
          <ProtectedRoute requiredRole="student">
            <DriveDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/applications"
        element={
          <ProtectedRoute requiredRole="student">
            <ApplicationStatus />
          </ProtectedRoute>
        }
      />

      {/* College Routes */}
      <Route
        path="/college/dashboard"
        element={
          <ProtectedRoute requiredRole="college">
            <TPODashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/college/students"
        element={
          <ProtectedRoute requiredRole="college">
            <StudentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/college/drives"
        element={
          <ProtectedRoute requiredRole="college">
            <DriveParticipation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/college/placements"
        element={
          <ProtectedRoute requiredRole="college">
            <PlacementRecords />
          </ProtectedRoute>
        }
      />

      {/* Company Routes */}
      <Route
        path="/company/dashboard"
        element={
          <ProtectedRoute requiredRole="company">
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/drives"
        element={
          <ProtectedRoute requiredRole="company">
            <div>Drives List (To be implemented)</div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/create-drive"
        element={
          <ProtectedRoute requiredRole="company">
            <CreateDrive />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/drives/:driveId/applicants"
        element={
          <ProtectedRoute requiredRole="company">
            <ApplicantScreening />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/drives/:driveId/offers"
        element={
          <ProtectedRoute requiredRole="company">
            <OfferManagement />
          </ProtectedRoute>
        }
      />

      {/* Default redirect based on role */}
      <Route path="/" element={<HomeRedirect />} />
    </Routes>
  );
};

export default AppRoutes;

