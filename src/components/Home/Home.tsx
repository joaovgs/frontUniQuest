import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { CompetitionService } from '../../services/Competition';
import { Competition } from '../../models/Competition';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const itemsPerPage = 3; 

  const fetchCompetitions = async () => {
    try {
      const response = await CompetitionService.getCompetitions();
      setCompetitions(response.competitions);
      console.log(response.competitions)
    } catch (error) {
      console.error('Erro ao buscar competições:', error);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleGincanaClick = (competition: Competition) => {
    navigate('/competition/details', { state: { competition } }); // Passando os dados da competição
  };

  const handleNext = () => {
    if (currentIndex < competitions.length - itemsPerPage) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="home-content">
      <main>
        <section className="current-event">
          <h1>Gincana em Destaque</h1>
          {competitions.length > 0 && competitions[0].image && (
            <img
              src={competitions[0].image}
              alt="Gincana Atual"
              className="current-event-image"
              onClick={() => handleGincanaClick(competitions[0])}
              style={{ cursor: 'pointer' }}
            />
          )}
        </section>

        <section className="previous-events">
          <h2>Gincanas Anteriores</h2>
          <div className="previous-events-container">
            {competitions.length > itemsPerPage && (
              <button
                className="prev-button"
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                &lt;
              </button>
            )}

            <div className="previous-event-images">
              {competitions.slice(currentIndex + 1, currentIndex + itemsPerPage + 1).map((competition) => (
                <img
                  key={competition.id}
                  src={competition.image || ''}
                  alt={competition.title}
                  className="previous-event-image"
                  onClick={() => handleGincanaClick(competition)} 
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>

            {competitions.length > itemsPerPage && (
              <button
                className="next-button"
                onClick={handleNext}
                disabled={currentIndex >= competitions.length - itemsPerPage}
              >
                &gt;
              </button>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
