import React from 'react';
import './GincanaDetails.css';
import { FaUserCircle } from 'react-icons/fa';

function GincanaDetails() {
  return (
    <div className="gincana-details-container">
      <header className="gincana-header">
        <img src="/images/logo.png" alt="Logo" className="gincana-logo" />
        <FaUserCircle className="gincana-user-icon" />
      </header>

      <main className="gincana-main">
        <h1>GINCANA 2024</h1>
        <div className="gincana-info">
          <img src="/images/gincanaatual.png" alt="Gincana Atual" className="gincana-image" />
          <div className="gincana-details">
            <p><strong>Data:</strong> 25/05/2024</p>
            <p><strong>Inscrições:</strong> 01/05/2024 - 20/05/2024</p>
            <p><strong>Horário:</strong> 19:00</p>
            <p><strong>Local:</strong> Centro de Convenções UNIRV</p>
            <p><strong>Detalhes:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque volutpat ac neque non euismod...</p>
            <button className="gincana-regulamento-button">Baixar Regulamento</button>
          </div>
        </div>

        <div className="gincana-provas">
          <h2>Provas</h2>
          <div className="provas-list">
            <button className="prova-item">Prova A - 25/05/2024 - 19:00</button>
            <button className="prova-item">Prova B - 25/05/2024 - 19:00</button>
            <button className="prova-item">Prova C - 25/05/2024 - 19:00</button>
            <button className="prova-item">Prova D - 25/05/2024 - 19:00</button>
            <button className="prova-item">Prova E - 25/05/2024 - 19:00</button>
            <button className="prova-item">Prova F - 25/05/2024 - 19:00</button>
          </div>
        </div>

        <div className="gincana-actions">
          <button className="ranking-button">Ranking 🏆</button>
          <button className="inscrever-button">Inscrever-se ➡</button>
        </div>
      </main>
    </div>
  );
}

export default GincanaDetails;
