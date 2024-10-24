import React, { useEffect, useState } from 'react';
import './CompetitionDetails.css';
import { useNavigate, useParams } from 'react-router-dom';
import { CompetitionService } from '../../services/Competition'; 

const CompetitionDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); 
  const [competition, setCompetition] = useState<any>(null); 
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const fetchCompetition = async () => {
      if (id) {
        try {
          const response = await CompetitionService.getById(Number(id)); 
          if (!response.competition) {
            navigate('/');
          } else {
            setCompetition(response.competition);
          }
        } catch (error) {
          console.error('Erro ao buscar competição:', error);
        } finally {
          setLoading(false); 
        }
      }
    };

    fetchCompetition();
  }, [id]);

  const handleRankingClick = () => {
    navigate('/ranking');
  };

  const handleTeamSignupClick = () => {
    if (id) {
      navigate(`/gincana/${id}/equipes`);
    }
  };
  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    const timePart = dateString.split('T')[1].split('.')[0];

    return `${day}/${month}/${year} ${timePart.substring(0, 5)}`;
  };

  const handleDownloadRegulation = async () => {
    try {
      if (competition?.id) {
        const response = await CompetitionService.getRegulation(competition.id);
        const base64Regulation = response.regulation as string;
        const byteCharacters = atob(base64Regulation.split(',')[1]);
        const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Regulamento.pdf'; 
        link.click();
      }
    } catch (error) {
      console.error('Erro ao baixar o regulamento:', error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>; 
  }

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
          <button className="competition-regulamento-button" onClick={handleDownloadRegulation}>
            Baixar Regulamento
          </button>
        </div>
      </div>

      <div className="competition-games">
        <h2>Provas</h2>
        <div className="games-list">
          {competition?.CompetitionGames?.map((game: any) => (
            <div key={game.id} className="games-item">
              <div className="game-name">{game.game_name}</div>
              <div className="game-info">Data: {formatDate(game.date_game)}</div>
              <div className="game-info">Local: {game.local}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="competition-actions">
        <button className="action-button" onClick={handleRankingClick}>
          Ranking 🏆
        </button>
        <button className="action-button" onClick={handleTeamSignupClick}>
          Inscrever-se ➡
        </button>
      </div>
    </div>
  );
};

export default CompetitionDetails;
