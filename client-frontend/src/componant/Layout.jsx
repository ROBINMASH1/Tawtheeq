import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ProtectedRoute from './ProtectedRoute';

import Home from '../pages/Home';
import Verify from '../pages/verify';
import Login from '../pages/login';
import StudentDashboard from '../pages/student-dashboard';
import MoheDashboard from '../pages/mohe-dashboard';
import StaffDashboard from '../pages/staff-dashboard';
import AdminDashboard from '../pages/admin-dashboard';
import ForgotPassword from '../pages/forgotPassword';
import UniversityManagement from '../pages/university-management';
import ProfileSetup from '../pages/profile-setup';
import ManageAdmins from '../pages/manage-admins';
import StaffManagement from '../pages/staff-management';
import NotFound from '../pages/NotFound';

export default function Layout() {
  const location = useLocation();

  const hideNavbarOn = ['/profile-setup'];
  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <main className={!shouldHideNavbar ? 'pt-16' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/verify/:certificateId" element={<Verify />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/student-dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />

          <Route path="/profile-setup" element={
            <ProtectedRoute profileSetupRoute>
              <ProfileSetup />
            </ProtectedRoute>
          } />

          <Route path="/mohe-dashboard" element={
            <ProtectedRoute allowedRoles={['moheadmin']}>
              <MoheDashboard />
            </ProtectedRoute>
          } />

          <Route path="/staff-dashboard" element={
            <ProtectedRoute allowedsubRoles={['unistaff']}>
              <StaffDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedsubRoles={['uniadmin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/university-management" element={
            <ProtectedRoute allowedRoles={["moheadmin"]}>
              <UniversityManagement />
            </ProtectedRoute>
          } />

          <Route path="/manage-admins" element={
            <ProtectedRoute allowedRoles={["moheadmin"]}>
              <ManageAdmins />
            </ProtectedRoute>
          } />

          <Route path="/staff-management" element={
            <ProtectedRoute allowedsubRoles={['uniadmin']}>
              <StaffManagement />
            </ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer className="pt-16" />
    </>
  );
}
