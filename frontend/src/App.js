import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/Home'; // Page d'accueil
import Room from './components/Room'; // Page des chambres
import About from './components/About';
import Reserver from './components/Reserver';
import Cantact from './components/Cantact';
import HomeRoom from './components/HomeRoom';
import LoginForm from './components/ui/LoginForm'
import SignupForm from './components/ui/SignupForm'
const App = () => {
  return (
    <Router>
      
   
  
      <Routes>
      <Route path="/" element={
  <div>
    {/* Affichage de la page d'accueil */}
    <Navbar />
    <Home />

    <HomeRoom/>

   
    <About />
    <Cantact />
  </div>
} />
      <Route path="/À propos" element={<About />} />
        <Route path="/Accueil" element={<Home />} />
        <Route path="/chambres" element={   <div>
          <Navbar />
          <Room />
        </div> 
                        } />
        <Route path="/reservation" element={<Reserver />} />
        <Route path="/LoginForm" element={<LoginForm />} />
        <Route path="/SignupForm" element={<SignupForm />} />
      </Routes>
      
    </Router>
    
  );
};

export default App;
