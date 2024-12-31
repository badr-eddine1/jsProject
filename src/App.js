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
const App = () => {
  return (
    <Router>
      <Navbar />
   
  
      <Routes>
      <Route path="/" element={
  <div>
    {/* Affichage de la page d'accueil */}
    <Home />

    <HomeRoom/>

   
    <About />
    <Cantact />
  </div>
} />
      <Route path="/À propos" element={<About />} />
        <Route path="/Accueil" element={<Home />} />
        <Route path="/chambres" element={<Room />} />
        <Route path="/reservation" element={<Reserver />} />
        <Route path="/LoginForm" element={<LoginForm />} />

      </Routes>
      
    </Router>
    
  );
};

export default App;
