import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/navbar';
import Home from './components/Home'; // Page d'accueil
import Room from './components/Room'; // Page des chambres


const App = () => {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/Accueil" element={<Home />} />
        <Route path="/chambres" element={<Room />} />
    
      </Routes>
    </Router>
  );
};

export default App;
