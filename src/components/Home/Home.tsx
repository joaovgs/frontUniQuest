import React, { useState, useEffect } from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { CompetitionService } from '../../services/Competition';
import { CompetitionImages } from '../../models/Competition';
import Spinner from '../Spinner/Spinner'; 
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [competitionsImages, setCompetitionsImages] = useState<CompetitionImages[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true); 
  const itemsPerPage = 3;

  const fetchCompetitionsImages = async () => {
    try {
      const response = await CompetitionService.getImages();
      setCompetitionsImages(response.competitions);
    } catch (error) {
      console.error('Erro ao buscar competições:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchCompetitionsImages();
  }, []);

  const handleGincanaClick = (competition: CompetitionImages) => {
    navigate(`/gincana/${competition.id}/detalhes`);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % (competitionsImages.length - 1)
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex - 1 + (competitionsImages.length - 1)) % (competitionsImages.length - 1)
    );
  };

  const getVisibleImages = () => {
    if (competitionsImages.length <= itemsPerPage + 1) {
      return competitionsImages.slice(1);
    }
    const visibleImages = [];
    for (let i = 0; i < itemsPerPage; i++) {
      visibleImages.push(
        competitionsImages[(currentIndex + 1 + i) % (competitionsImages.length - 1) + 1]
      );
    }
    return visibleImages;
  };

  return (
    <div className="home-content">
      {loading ? ( 
        <Spinner />
      ) : (
        <main>
          <section className="current-event">
            <h1>Gincana em Destaque</h1>
            {competitionsImages.length > 0 && competitionsImages[0].image && (
              <img
                src={competitionsImages[0].image}
                alt="Gincana Atual"
                className="current-event-image"
                onClick={() => handleGincanaClick(competitionsImages[0])}
                style={{ cursor: 'pointer' }}
              />
            )}
          </section>

          {competitionsImages.length > 0 && (
            <section className="previous-events">
              <h2>Gincanas Anteriores</h2>
              <div className="previous-events-container">
                <button
                  className="prev-button"
                  onClick={handlePrev}
                >
                  <FaArrowLeft />
                </button>

                <div className="previous-event-images">
                  {getVisibleImages().map((competition) => (
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

                <button
                  className="next-button"
                  onClick={handleNext}
                >
                  <FaArrowRight />
                </button>
              </div>
            </section>
          )}
        </main>
      )}
    </div>
  );
};

export default Home;
