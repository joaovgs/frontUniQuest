import React from 'react'
import './Home.css'
import { useNavigate } from 'react-router-dom' // Importar useNavigate

const Home: React.FC = () => {
  const navigate = useNavigate() // Hook para navegação

  // Função para redirecionar para a tela de GincanaDetails
  const handleGincanaClick = () => {
    navigate('/gincana/details') // Altere o caminho conforme necessário
  }

  return (
    <div className="home-content">
      <main>
        <section className="current-event">
          <h1>Gincana em Andamento</h1>
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
            <div className="previous-event-images">
              <img src="/images/gincanaatual.png" alt="Gincana Anterior 1" className="previous-event-image"/>
              <img src="/images/gincanaatual.png" alt="Gincana Anterior 2" className="previous-event-image"/>
              <img src="/images/gincanaatual.png" alt="Gincana Anterior 3" className="previous-event-image"/>
            </div>
            <button className="next-button">&gt;</button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
