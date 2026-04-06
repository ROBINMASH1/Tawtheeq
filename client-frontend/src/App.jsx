
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './componant/Footer';
import Navbar from './componant/Navbar';

export default function App() {
  

  return (
    
    
    <BrowserRouter>
      <Navbar />
      <Routes>
        
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>  
    
  )
}


