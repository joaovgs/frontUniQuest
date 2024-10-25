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
  const [activeRound, setActiveRound] = useState(0);
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
      setDragKey(dragKey + 1);
    }
  }, [matches]);

  useEffect(() => {
    if (matches.length > 0 && activeRound >= matches.length) {
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
          </div>

          <div className="tab-content">
            {matches.length > 0 && (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId={`droppable-${activeRound}`} key={`droppable-${activeRound}-${dragKey}`}>
                  {(provided) => (
                    <ul
                      className="matches-list"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
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
                              <span className="position">{`${team.position}º`}</span>
                              <span className="name">{team.team_name}</span>
                              <span className="score">{team.score}</span>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
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