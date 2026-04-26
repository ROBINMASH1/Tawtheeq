
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './componant/Footer';
import Navbar from './componant/Navbar';
import Verify from './pages/verify';
import Login from './pages/login';
import StudentDashboard from './pages/student-Dashboard';
import MoheDashboard from './pages/mohe-dashboard';
import StaffDashboard from './pages/staff-dashboard';
import AdminDashboard from './pages/admin-dashboard';
import ForgotPassword from './pages/forgotPassword';
import ProtectedRoute from './componant/ProtectedRoute';
import UniversityManagement from './pages/university-management';
import ProfileSetup from './pages/profile-setup';
import ManageAdmins from './pages/manage-admins';
import StaffManagement from './pages/staff-management';
import ScrollToTop from './componant/scroll';
import { useLocation } from 'react-router-dom';
import Test from './pages/test';
function Layout({ children }) {
  const location = useLocation();

  const hideNavbarOn = ['/profile-setup'];
  const shouldHideNavbar = hideNavbarOn.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <main className={!shouldHideNavbar ? 'pt-16' : ''}>
        {children}
      </main>
    </>
  );
}
export default function App() {
  

  return (
    
    
    <BrowserRouter>
    <ScrollToTop />
      <Layout>
        
      
      
      <Routes className="pt-16" >
        
        <Route path="/" element={<Home />} className="pt-16"/>
        <Route path="/verify" element={<Verify />} className="pt-16"/>
        <Route path="/login" element={<Login />} className="pt-16"/>
        <Route path="/forgot-password" element={<ForgotPassword />} className="pt-16"/>
        <Route path="/test" element={<Test />} className="pt-16"/>

        <Route path="/student-dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />

                <Route path="/profile-setup" element={
          <ProtectedRoute allowedRoles={['student']}>
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
        
      </Routes>
      </Layout>
      <Footer className="pt-16"/>
    </BrowserRouter>  
    
  )
}


