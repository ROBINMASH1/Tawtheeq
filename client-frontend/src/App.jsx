
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './componant/Footer';
import Navbar from './componant/Navbar';
import Verify from './pages/verify';
import Login from './pages/login';
import StudentDashboard from './pages/studentDashboard';
import MoheDashboard from './pages/moheDashboard';
import StaffDashboard from './pages/staffDashboard';
import AdminDashboard from './pages/adminDashboard';
import ForgotPassword from './pages/forgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './componant/scroll';
export default function App() {
  

  return (
    
    
    <BrowserRouter>
    <ScrollToTop />
      <Navbar />
      
      <Routes className="pt-16" >
        
        <Route path="/" element={<Home />} className="pt-16"/>
        <Route path="/verify" element={<Verify />} className="pt-16"/>
        <Route path="/login" element={<Login />} className="pt-16"/>
        <Route path="/forgot-password" element={<ForgotPassword />} className="pt-16"/>
        <Route path="/student-dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/mohe-dashboard" element={
          <ProtectedRoute allowedRoles={['mohe admin']}>
            <MoheDashboard />
          </ProtectedRoute>
        } />

        <Route path="/staff-dashboard" element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin-dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer className="pt-16"/>
    </BrowserRouter>  
    
  )
}


