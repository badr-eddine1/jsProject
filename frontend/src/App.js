import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Contact from './components/Contact';
import LoginForm from './components/ui/LoginForm';  
import SignupForm from './components/ui/SignupForm'; 
import About from './components/About';
import Profile from './components/Profile';
import MesLogements from './components/MesLogement';
import AdminDashboard from './components/AdminDashboard';
import AddLogementDialog from './components/AddLogementDialog';
import Chatbot from './components/chatbot';


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
        <Route path="/Profile" element={<Profile />} />
        <Route path="/mes-logements" element={<MesLogements />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/ajouter-logement" element={< AddLogementDialog/>} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;
