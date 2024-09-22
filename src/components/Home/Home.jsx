import React from 'react';
import './Home.css';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate

function Home() {
  const navigate = useNavigate(); // Hook para navegação

  // Função para redirecionar para a tela de GincanaDetails
  const handleGincanaClick = () => {
    navigate('/gincana/details'); // Altere o caminho conforme necessário
  };

  return (
    <div className="home-content">
      <header className="home-header">
        <FaUserCircle className="home-user-icon" />
      </header>

      <main>
        <section className="current-event">
          <h2>Gincana em Andamento</h2>
          <img 
            src="/images/gincanaatual.png" 
            alt="Gincana Atual" 
            className="current-event-image" 
            onClick={handleGincanaClick} // Adicionar o clique para navegação
            style={{ cursor: 'pointer' }} // Adicionar um ponteiro para indicar que a imagem é clicável
          />
        </section>

        <section className="previous-events">
          <h2>Gincanas Anteriores</h2>
          <div className="previous-events-container">
            <button className="prev-button">&lt;</button>
            <div className="event-images">
              <h4>Gincana Anterior 2023</h4>
              <h4>Gincana Anterior 2022</h4>
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
