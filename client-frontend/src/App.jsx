
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './componant/Footer';
import Navbar from './componant/Navbar';
import Verify from './pages/verify';
import Login from './pages/login';
import ForgotPassword from './pages/forgotPassword';
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
      </Routes>
      <Footer className="pt-16"/>
    </BrowserRouter>  
    
  )
}


