import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './AllAgainstAllMatches.css';
import { AllAgainstAllMatchService } from '../../services/AllAgainstAllMatch';
import { AllAgainstAllMatch, AllAgainstAllMatchPayload } from '../../models/AllAgainstAllMatch';
import { useSnackbar } from '../../context/SnackbarContext';
import PresentTeamsList from '../PresentTeamsList/PresentTeamsList';
import { GameService } from '../../services/Game';
import Spinner from '../Spinner/Spinner';
import { useAuth } from '../../context/AuthContext';
import { FaTable, FaSave } from 'react-icons/fa';

const AllAgainstAllMatches: React.FC = () => {
  const { competitionId, gameId } = useParams<{ competitionId: string; gameId: string }>();
  const { role } = useAuth();
  const [matches, setMatches] = useState<AllAgainstAllMatch[]>([]);
  const [numRounds, setNumRounds] = useState<number | ''>();
  const { showSnackbar } = useSnackbar();
  const [showTeamsList, setShowTeamsList] = useState(false);
  const [activeRound, setActiveRound] = useState(0);
  const [dragKey, setDragKey] = useState(0);
  const [updatedPlacements, setUpdatedPlacements] = useState<{ [key: number]: any[] }>({});
  const [isModified, setIsModified] = useState(false);
  const [gameName, setGameName] = useState('Prova');
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMatches = useCallback(async () => {
    if (competitionId && gameId) {
      setLoading(true);
      try {
        const response = await AllAgainstAllMatchService.getAllAgainstAllMatches(Number(competitionId), Number(gameId));
        setMatches(response.allAgainstAllMatches);
        console.log('Matches fetched:', response.allAgainstAllMatches);
      } catch (error) {
        console.error('Erro ao buscar partidas:', error);
      } finally {
        setLoading(false);
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
    if (matches.length > 0 && activeRound >= matches.length + 1) {
      setActiveRound(0);
    }
  }, [matches, activeRound]);

  useEffect(() => {
    setUpdatedPlacements({});
  }, [matches]);

  const handleGenerateMatches = () => {
    if ((numRounds || 0) <= 0) {
      showSnackbar('Número de partidas é obrigatório.', 'error');
      return;
    }

    if (matches.length > 0) {
      setShowTeamsList(true);
    } else {
      setShowTeamsList(true);
    }
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
          number_of_rounds: Number(numRounds),
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
      .sort((a, b) => b.score - a.score);
  };

  const onDragEnd = (result: any) => {
    if (role !== 1) return;

    const { source, destination } = result;

    if (!destination) return;

    const currentMatch = matches[activeRound];
    const newPlacements = [...(updatedPlacements[activeRound] || currentMatch.AllAgainstAllPlacement)];
    const [movedTeam] = newPlacements.splice(source.index, 1);
    newPlacements.splice(destination.index, 0, movedTeam);

    setUpdatedPlacements((prev) => ({
      ...prev,
      [activeRound]: newPlacements.map((team, idx) => ({
        ...team,
        position: idx + 1,
      })),
    }));

    setIsModified(true);
  };

  const totalScores = calculateTotalScores();

  const handleSavePlacements = async () => {
    const currentMatch = matches[activeRound];
    const placementsToSave = updatedPlacements[activeRound];

    if (!placementsToSave) return;

    try {
      await AllAgainstAllMatchService.updatePlacementsAllAgainstAllMatch(
        currentMatch.id,
        Number(competitionId),
        Number(gameId),
        placementsToSave,
      );
      showSnackbar('Colocações salvas com sucesso!', 'success');
      
      await fetchMatches();
      
      setIsModified(false);
    } catch (error) {
      console.error('Erro ao salvar colocações:', error);
      showSnackbar('Erro ao salvar colocações. Tente novamente.', 'error');
    }
  };

  const fetchGameName = useCallback(async () => {
    if (gameId) {
      try {
        const response = await GameService.getGameById(Number(gameId));
        setGameName(response.game.name);
        console.log('Game name fetched:', response.game.name);
      } catch (error) {
        console.error('Erro ao buscar nome do jogo:', error);
      }
    }
  }, [gameId]);

  useEffect(() => {
    if (matches.length > 0) {
      setGameName(matches[0].game_name);
    } else {
      fetchGameName();
    }
  }, [matches, fetchGameName]);

  return (
    <div className="container">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <h1>{gameName}</h1>

          {role === 1 && (
            <div className="generate-matches-container">
              <h3>Todos Contra Todos</h3>
              <div className="generate-matches-input-container">
                <input
                  type="number"
                  placeholder=""
                  value={numRounds}
                  onChange={(e) => setNumRounds(Number(e.target.value))}
                  className="input-num-matches"
                />
                <button className="generate-matches-button" onClick={handleGenerateMatches}>
                  <FaTable style={{ marginRight: '8px' }} />
                  Gerar Partidas
                </button>
              </div>
            </div>
          )}

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
                    onClick={() => setActiveRound(index)}
                  >
                    {index + 1}ª partida
                  </button>
                ))}
                {matches.length > 1 && (
                  <button
                    className={activeRound === matches.length ? 'active-tab' : 'inative-tab'}
                    onClick={() => setActiveRound(matches.length)}
                  >
                    Geral
                  </button>
                )}
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
                        <li key={team.team_id} className="draggable-item non-draggable-item-cursor">
                          <span className="name">{team.team_name}</span>
                          <span className="score">{team.score}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <>
                    <DragDropContext onDragEnd={role === 1 ? onDragEnd : () => {}}>
                      <Droppable droppableId={`droppable-${activeRound}`} key={`droppable-${activeRound}-${dragKey}`}>
                        {(provided) => (
                          <div className="matches-table" {...provided.droppableProps} ref={provided.innerRef}>
                            <ul className="fixed-positions">
                              {(updatedPlacements[activeRound] || matches[activeRound].AllAgainstAllPlacement).map((_, idx) => (
                                <li key={`position-${idx}`} className="position-item">
                                  {`${idx + 1}º`}
                                </li>
                              ))}
                            </ul>
                            <ul className="matches-list">
                              {(updatedPlacements[activeRound] || matches[activeRound].AllAgainstAllPlacement).map((team, idx) => (
                                role === 1 ? (
                                  <Draggable key={`draggable-${team.team_id}`} draggableId={`team-${team.team_id}`} index={idx}>
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
                                ) : (
                                  <li key={`non-draggable-${team.team_id}`} className="draggable-item non-draggable-item-cursor">
                                    <span className="name">{team.team_name}</span>
                                    <span className="score">{team.score}</span>
                                  </li>
                                )
                              ))}
                              {provided.placeholder}
                            </ul>
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                    {role === 1 && (
                      <div className="save-button-container">
                        <button
                          onClick={handleSavePlacements}
                          className="save-results-button"
                          disabled={!isModified}
                        >
                          <FaSave style={{ marginRight: '8px' }} />
                          Salvar Resultados
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AllAgainstAllMatches;
