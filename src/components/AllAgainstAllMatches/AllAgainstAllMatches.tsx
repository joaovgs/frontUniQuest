import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './AllAgainstAllMatches.css';
import { AllAgainstAllMatchService } from '../../services/AllAgainstAllMatch';
import { AllAgainstAllMatch, AllAgainstAllMatchPayload } from '../../models/AllAgainstAllMatch';
import { useSnackbar } from '../../context/SnackbarContext';
import PresentTeamsList from '../PresentTeamsList/PresentTeamsList'; 

const AllAgainstAllMatches: React.FC = () => {
  const { competitionId, gameId } = useParams<{ competitionId: string; gameId: string }>();
  const [matches, setMatches] = useState<AllAgainstAllMatch[]>([]);
  const [numRounds, setNumRounds] = useState(1);
  const { showSnackbar } = useSnackbar();
  const [showTeamsList, setShowTeamsList] = useState(false);
  const [activeRound, setActiveRound] = useState(0); // 0 por padrão na 1ª partida
  const [dragKey, setDragKey] = useState(0);

  const gameName = matches.length > 0 ? matches[0].game_name : 'Prova';

  const fetchMatches = useCallback(async () => {
    if (competitionId && gameId) {
      try {
        const response = await AllAgainstAllMatchService.getAllAgainstAllMatches(Number(competitionId), Number(gameId));
        setMatches(response.allAgainstAllMatches);
      } catch (error) {
        console.error('Erro ao buscar partidas:', error);
      }
    }
  }, [competitionId, gameId]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    if (matches.length > 0) {
      setDragKey((prevDragKey) => prevDragKey + 1);
    }
  }, [matches]);

  useEffect(() => {
    if (matches.length > 0 && activeRound >= matches.length + 1) { // Ajuste para manter "Geral" sempre visível
      setActiveRound(0);
    }
  }, [matches, activeRound]);

  const handleGenerateMatches = () => {
    setShowTeamsList(true);
  };

  const handleCloseTeamsList = () => {
    setShowTeamsList(false);
  };

  const handleConfirmTeamsList = async (presentTeams: number[]) => {
    setShowTeamsList(false);

    if (competitionId && gameId) {
      try {
        const payload: AllAgainstAllMatchPayload = {
          competition_id: Number(competitionId),
          game_id: Number(gameId),
          number_of_rounds: numRounds,
          teams: presentTeams, 
        };

        try {
          await AllAgainstAllMatchService.deleteAllAgainstAllMatch(Number(competitionId), Number(gameId));
        } catch (error: any) {
          if (error.response && error.response.status === 404) {
            console.warn('No matches to delete, proceeding to create new matches.');
          } else {
            throw error;
          }
        }
        
        await AllAgainstAllMatchService.createAllAgainstAllMatch(payload);
        
        fetchMatches();
        
        showSnackbar('Partidas todos contra todos geradas com sucesso!', 'success');
      } catch (error) {
        console.error('Erro ao gerar partidas todos contra todos:', error);
        showSnackbar('Erro ao gerar partidas. Tente novamente.', 'error');
      }
    }
  };

  const calculateTotalScores = () => {
    const teamScores: { [key: number]: number } = {};

    matches.forEach(match => {
      match.AllAgainstAllPlacement.forEach(team => {
        teamScores[team.team_id] = (teamScores[team.team_id] || 0) + team.score;
      });
    });

    return Object.entries(teamScores)
      .map(([team_id, score]) => ({
        team_id: Number(team_id),
        team_name: matches[0].AllAgainstAllPlacement.find(t => t.team_id === Number(team_id))?.team_name || 'Equipe',
        score,
      }))
      .sort((a, b) => b.score - a.score); // Ordena por pontuação decrescente
  };

  const onDragEnd = async (result: any) => {
    const { source, destination } = result;

    if (!destination) return;

    const updatedMatches = [...matches];
    const currentMatch = updatedMatches[activeRound];
    
    const updatedPlacements = [...currentMatch.AllAgainstAllPlacement];
    const [movedTeam] = updatedPlacements.splice(source.index, 1);
    updatedPlacements.splice(destination.index, 0, movedTeam);

    const positionsChanged = updatedPlacements.some((team, idx) => team.position !== idx + 1);
    if (!positionsChanged) return; 

    const newPlacements = updatedPlacements.map((team, idx) => ({
      team_id: team.team_id,
      position: idx + 1,
    }));

    currentMatch.AllAgainstAllPlacement = updatedPlacements;
    setMatches(updatedMatches);

    try {
      await AllAgainstAllMatchService.updatePlacementsAllAgainstAllMatch(
        currentMatch.id,         
        Number(competitionId), 
        Number(gameId),
        newPlacements, 
      );
      showSnackbar('Colocações atualizadas com sucesso!', 'success');
      
      fetchMatches();
    } catch (error) {
      console.error('Erro ao atualizar colocações:', error);
      showSnackbar('Erro ao atualizar colocações. Tente novamente.', 'error');
    }
  };

  const totalScores = calculateTotalScores();

  return (
    <div className="container">
      <h1>{gameName}</h1>
      
      <div className="generate-matches-container">
        <h3>Todos Contra Todos</h3>
        <input
          type="number"
          value={numRounds}
          onChange={(e) => setNumRounds(Number(e.target.value))}
          min={1}
          max={10}
          className="input-num-matches"
        />
        <button className="generate-matches-button" onClick={handleGenerateMatches}>
          Gerar Partidas ⚙️
        </button>
      </div>

      {showTeamsList && (
        <PresentTeamsList 
          competitionId={Number(competitionId)} 
          onClose={handleCloseTeamsList} 
          onConfirm={handleConfirmTeamsList} 
        />
      )}

      {matches.length === 0 ? (
        <div className="no-matches">Sem partidas criadas</div>
      ) : (
        <>
          <div className="matches-tabs">
            {matches.map((match, index) => (
              <button
                key={match.id}
                className={activeRound === index ? 'active-tab' : 'inative-tab'}
                onClick={() => {
                  setActiveRound(index);
                  setDragKey(dragKey + 1); 
                }}
              >
                {index + 1}ª partida
              </button>
            ))}
            <button
              className={activeRound === matches.length ? 'active-tab' : 'inative-tab'}
              onClick={() => setActiveRound(matches.length)}
            >
              Geral
            </button>
          </div>

          <div className="tab-content">
            {activeRound === matches.length ? (
              <div className="matches-table">
                <ul className="fixed-positions">
                  {totalScores.map((_, idx) => (
                    <li key={`position-${idx}`} className="position-item">
                      {`${idx + 1}º`}
                    </li>
                  ))}
                </ul>
                <ul className="matches-list">
                  {totalScores.map((team, idx) => (
                    <li key={team.team_id} className={`draggable-item ${activeRound === matches.length ? 'non-draggable-item-cursor' : 'draggable-item-cursor'}`}>
                      <span className="name">{team.team_name}</span>
                      <span className="score">{team.score}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={`droppable-${activeRound}`} key={`droppable-${activeRound}-${dragKey}`}>
                  {(provided) => (
                    <div className="matches-table">
                      <ul className="fixed-positions">
                        {Array.from({ length: matches[activeRound].AllAgainstAllPlacement.length }, (_, idx) => (
                          <li key={`position-${idx}`} className="position-item">
                            {`${idx + 1}º`}
                          </li>
                        ))}
                      </ul>
                      
                      <ul className="matches-list" {...provided.droppableProps} ref={provided.innerRef}>
                        {matches[activeRound].AllAgainstAllPlacement.map((team, idx) => (
                          <Draggable
                            key={`draggable-${team.team_id}-${activeRound}-${idx}-${dragKey}`}
                            draggableId={`team-${team.team_id}-${activeRound}`}
                            index={idx}
                          >
                            {(provided) => (
                              <li
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="draggable-item"
                              >
                                <span className="name">{team.team_name}</span>
                                <span className="score">{team.score}</span>
                              </li>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </ul>
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AllAgainstAllMatches;
