import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Contact from './components/Contact';
import LoginForm from './components/ui/LoginForm';  
import SignupForm from './components/ui/SignupForm'; 
import About from './components/About';
import Navbar from './components/navbar';
function App() {
  return (
    <Router>
      <Routes>
        {/* Route pour Home + Contact */}
        <Route path="/home" element={
          <>
          
            <Home />
            
            <Contact />
          </>
        } />
        <Route path="/" element={
          <>
            
            <About />
            
           
          </>
        } />

        {/* Route pour Login */}
        <Route path="/loginForm" element={<LoginForm />} />
        <Route path="/SignupForm" element={<SignupForm />} />
      </Routes>
    </Router>
  );
}

export default App;
