import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home/Home';
import GincanaDetails from './components/Gincana/GincanaDetails'; // Importa apenas o componente necessário

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gincana/details" element={<GincanaDetails />} /> {/* Apenas a rota para detalhes da gincana */}
      </Routes>
    </Router>
  );
}

export default App;
