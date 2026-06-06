import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Dashboard
import DashboardPage from './pages/dashboard/DashboardPage';

// CRUD pages
import StudentsPage from './pages/students/StudentsPage';
import ClassStreamsPage from './pages/classStreams/ClassStreamsPage';
import SubjectsPage from './pages/subjects/SubjectsPage';
import AssessmentsPage from './pages/assessments/AssessmentsPage';
import ScorePage from './pages/scores/ScorePage';
import ReportPage from './pages/reports/ReportPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/students"
            element={
              <ProtectedRoute>
                <StudentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/class-streams"
            element={
              <ProtectedRoute>
                <ClassStreamsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/subjects"
            element={
              <ProtectedRoute>
                <SubjectsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/assessments"
            element={
              <ProtectedRoute>
                <AssessmentsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/scores"
            element={
              <ProtectedRoute>
                <ScorePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
