import React from 'react';
import './Home.css';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Importa o hook para navegação

function Home() {
  const navigate = useNavigate(); // Hook para navegação

  const handleImageClick = () => {
    navigate('/gincana/details'); // Redireciona para a página de detalhes da gincana
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <img src="/images/logo.png" alt="Logo" className="home-logo" />
        <FaUserCircle className="home-user-icon" />
      </header>
      
      <main>
        <section className="current-event">
          <h2>Gincana em Andamento</h2>
          <img 
            src="/images/gincanaatual.png" 
            alt="Gincana Atual" 
            className="current-event-image" 
            onClick={handleImageClick} // Redireciona ao clicar na imagem
            style={{ cursor: 'pointer' }} // Adiciona cursor de pointer para indicar que a imagem é clicável
          />
        </section>

        <section className="previous-events">
          <h2>Gincanas Anteriores</h2>
          <div className="previous-events-container">
            <button className="prev-button">&lt;</button>
            <div className="event-images">
              <img src="/images/gincana-anterior1.png" alt="Gincana Anterior 1" />
              <img src="/images/gincana-anterior2.png" alt="Gincana Anterior 2" />
              <img src="/images/gincana-anterior3.png" alt="Gincana Anterior 3" />
            </div>
            <button className="next-button">&gt;</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Home;
