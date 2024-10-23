import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { CompetitionService } from '../../services/Competition';
import { CompetitionImages } from '../../models/Competition';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [competitionsImages, setCompetitionsImages] = useState<CompetitionImages[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0); 
  const itemsPerPage = 3; 

  const fetchCompetitionsImages = async () => {
    try {
      const response = await CompetitionService.getImages();
      setCompetitionsImages(response.competitions);
    } catch (error) {
      console.error('Erro ao buscar competições:', error);
    }
  };

  useEffect(() => {
    fetchCompetitionsImages();
  }, []);

  const handleGincanaClick = (competition: CompetitionImages) => {
    navigate(`/gincana/${competition.id}/detalhes`);
  };

  const handleNext = () => {
    if (currentIndex < competitionsImages.length - itemsPerPage) {
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
          {competitionsImages && competitionsImages.length > 0 && competitionsImages[0].image && (
            <img
              src={competitionsImages[0].image}
              alt="Gincana Atual"
              className="current-event-image"
              onClick={() => handleGincanaClick(competitionsImages[0])}
              style={{ cursor: 'pointer' }}
            />
          )}
        </section>

        {competitionsImages && competitionsImages.length > 1 && ( 
          <section className="previous-events">
            <h2>Gincanas Anteriores</h2>
            <div className="previous-events-container">
              {competitionsImages.length > itemsPerPage && (
                <button
                  className="prev-button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                >
                  &lt;
                </button>
              )}

              <div className="previous-event-images">
                {competitionsImages.slice(currentIndex + 1, currentIndex + itemsPerPage + 1).map((competition) => (
                  <img
                    key={competition.id}
                    src={competition.image || ''}
                    alt={'Imagem da Gincana'}
                    className="previous-event-image"
                    onClick={() => handleGincanaClick(competition)} 
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </div>

              {competitionsImages.length > itemsPerPage && (
                <button
                  className="next-button"
                  onClick={handleNext}
                  disabled={currentIndex >= competitionsImages.length - itemsPerPage}
                >
                  &gt;
                </button>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Home;
