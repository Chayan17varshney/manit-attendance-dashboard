import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Login from './pages/auth/Login';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './pages/Director/dashboard/Dashboard';
import { ToastContainer } from 'react-toastify';
import Landing from './pages/Landing';
import QuickHelp from './pages/shared/QuickHelp';
import "react-toastify/dist/ReactToastify.css";
import { Dashboard as FacultyDashboard } from './pages/Faculty/dashboard/Dashboard';
import { useEffect, useState } from 'react';
import { Dashboard as HODDashboard } from './pages/HOD/dashboard/Dashboard';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/dashboard/Dashboard';
import ServicesLayout from './pages/admin/services/ServicesLayout';
import DepartmentService from './pages/admin/services/DepartmentService';
import CourseService from './pages/admin/services/CourseService';
import SessionService from './pages/admin/services/SessionService';
import BranchService from './pages/admin/services/BranchService';
import SemesterService from './pages/admin/services/SemesterService';
import StudentService from './pages/admin/services/StudentService';
import ReportsPage from './pages/admin/reports/ReportsPage';
import UsersPage from './pages/admin/users/UsersPage';
import SettingsPage from './pages/admin/settings/SettingsPage';
import ApprovalsPage from './pages/admin/approvals/ApprovalsPage';

function App() {
  const [toastPosition, setToastPosition] = useState(
    window.innerWidth < 768 ? "bottom-center" : "top-right"
  );

  useEffect(() => {
    const handleResize = () => {
      setToastPosition(window.innerWidth < 768 ? "bottom-center" : "top-right");
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <ToastContainer
        position={toastPosition as any}
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Landing />} />

          <Route path="/" element={<Layout />}>
            {/* Faculty Routes */}
            <Route
              path="faculty/dashboard"
              element={
                <ProtectedRoute allowedRoles={['FACULTY']}>
                  <FacultyDashboard />
                </ProtectedRoute>
              }
            />

            {/* HOD Routes */}
            <Route
              path="hod/dashboard"
              element={
                <ProtectedRoute allowedRoles={['HOD_CSE']}>
                  <HODDashboard />
                </ProtectedRoute>
              }
            />

            {/* Director Routes */}
            <Route
              path="director/dashboard"
              element={
                <ProtectedRoute allowedRoles={['DIRECTOR']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* QuickHelp Routes */}
            <Route
              path="hod/QuickHelp"
              element={
                <ProtectedRoute allowedRoles={['HOD']}>
                  <QuickHelp />
                </ProtectedRoute>
              }
            />
            <Route
              path="faculty/QuickHelp"
              element={
                <ProtectedRoute allowedRoles={['FACULTY']}>
                  <QuickHelp />
                </ProtectedRoute>
              }
            />
            <Route
              path="director/QuickHelp"
              element={
                <ProtectedRoute allowedRoles={['DIRECTOR']}>
                  <QuickHelp />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />

            {/* Services Routes */}
            <Route path="services">
              <Route index element={<ServicesLayout />} />
              <Route path="department" element={<DepartmentService />} />
              <Route path="course" element={<CourseService />} />
              <Route path="session" element={<SessionService />} />
              <Route path="branch" element={<BranchService />} />
              <Route path="semester" element={<SemesterService />} />
              <Route path="student" element={<StudentService />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="reports" element={<ReportsPage />} />
            </Route>

            {/* Settings Route */}
            <Route path="settings" element={<SettingsPage />} />

            {/* Approvals Route */}
            <Route path="approvals" element={<ApprovalsPage />} />

            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;