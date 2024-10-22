import React from 'react';
import './CompetitionDetails.css';
import { useNavigate, useLocation } from 'react-router-dom';

const CompetitionDetails: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const competition = location.state?.competition;

  const handleRankingClick = () => {
    navigate('/ranking');
  };

  const handleTeamSignupClick = () => {
    navigate('/teamsignup');
  };

  // Função para formatar a data em dd/mm/aaaa HH:mm
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const timePart = dateString.split('T')[1].split('.')[0];

    return `${day}/${month}/${year} ${timePart.substring(0, 5)}`;
  };

  return (
    <div className="competition-details-container">
      <h1>{competition?.title || 'Gincana 2024'}</h1>
      <div className="competition-info">
        <img
          src={competition?.image}
          alt="Imagem da Gincana"
          className="competition-image"
        />
        <div className="competition-details">
          <p>
            <strong>Data:</strong> {competition?.date_event ? formatDate(competition.date_event) : 'Data não informada'}
          </p>
          <p>
            <strong>Horário:</strong> {competition?.date_event ? formatDate(competition.date_event).split(' ')[1] : 'Horário não informado'}
          </p>
          <p>
            <strong>Inscrições:</strong>&nbsp;
            {competition?.start_registration
              ? formatDate(competition.start_registration)
              : 'Data não informada'}&nbsp;
            até&nbsp;
            {competition?.end_registration
              ? formatDate(competition.end_registration)
              : 'Data não informada'}
          </p>
          <p>
            <strong>Local:</strong> {competition?.local || 'Local não informado'}
          </p>
          <p>
            <strong>Detalhes:</strong> {competition?.description || 'Descrição não informada'}
          </p>
          <button className="competition-regulamento-button">
            Baixar Regulamento
          </button>
        </div>
      </div>

      <div className="competition-games">
        <h2>Provas</h2>
        <div className="games-list">
          {competition?.CompetitionGames?.map((game: any) => (
            <div key={game.id} className="game-item">
              <div className="game-name">{game.game_name}</div>
              <div className="game-info">Data: {formatDate(game.date_game)}</div>
              <div className="game-info">Local: {game.local}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="competition-actions">
        <button className="create-button" onClick={handleRankingClick}>
          Ranking 🏆
        </button>
        <button className="create-button" onClick={handleTeamSignupClick}>
          Inscrever-se ➡
        </button>
      </div>
    </div>
  );
};

export default CompetitionDetails;
