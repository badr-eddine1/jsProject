import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/Home'; // Page d'accueil
import Room from './components/Room'; // Page des chambres
import About from './components/About';
import Contact from './components/Cantact';

const App = () => {
  return (
    <Router>
      <Navbar />
   
  
      <Routes>
      <Route path="/" element={
  <div>
    {/* Affichage de la page d'accueil */}
    <Home />

    {/* Espacement entre les deux sections */}
    <div style={{ marginTop: '40px' }} />

    {/* Affichage de la page À propos */}
    <About />
  </div>
} />
      <Route path="/À propos" element={<About />} />
        <Route path="/Accueil" element={<Home />} />
        <Route path="/chambres" element={<Room />} />
        <Route path="/Contact" element={<Contact />} />
    
      </Routes>
    </Router>
  );
};

export default App;
