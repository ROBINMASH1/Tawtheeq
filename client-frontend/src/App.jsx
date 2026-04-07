
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './componant/Footer';
import Navbar from './componant/Navbar';
import Verify from './pages/verify';

export default function App() {
  

  return (
    
    
    <BrowserRouter>
      <Navbar />
      <Routes className="pt-16" >
        
        <Route path="/" element={<Home />} className="pt-16"/>
        <Route path="/verify" element={<Verify />} className="pt-16"/>
      </Routes>
      <Footer className="pt-16"/>
    </BrowserRouter>  
    
  )
}


