import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Contact from './components/Contact';
import LoginForm from './components/ui/LoginForm';  
import SignupForm from './components/ui/SignupForm'; 
function App() {
  return (
    <Router>
      <Routes>
        {/* Route pour Home + Contact */}
        <Route path="/" element={
          <>
            <Home />
            <Contact />
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
