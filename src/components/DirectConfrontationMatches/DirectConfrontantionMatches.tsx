import React, { useEffect, useState, useCallback } from 'react';
import { useParams, } from 'react-router-dom';
import './DirectConfrontationMatches.css';
import MatchWinnerModal from '../DirectConfrontationMatchWinner/DirectConfrontationMatchWinner';
import PresentTeamsList from '../PresentTeamsList/PresentTeamsList';
import { DirectConfrontationMatchService } from '../../services/DirectConfrontationMatch';
import { DirectConfrontationMatch, DirectConfrontationMatchPayload } from '../../models/DirectConfrontationMatch';
import { useSnackbar } from '../../context/SnackbarContext';

const DirectConfrontationMatches: React.FC = () => {
  const { competitionId, gameId } = useParams<{ competitionId: string; gameId: string }>();
  const [matches, setMatches] = useState<DirectConfrontationMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<DirectConfrontationMatch | null>(null);
  const [showTeamsList, setShowTeamsList] = useState(false);
  const { showSnackbar } = useSnackbar();

  const fetchMatches = useCallback(async () => {
    if (competitionId && gameId) {
      try {
        const response = await DirectConfrontationMatchService.getDirectConfrontationMatches(Number(competitionId), Number(gameId));
        setMatches(response.directConfrontationMatches);
        console.log('Fetched matches:', response.directConfrontationMatches);
      } catch (error) {
        console.error('Erro ao buscar partidas:', error);
      }
    }
  }, [competitionId, gameId]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const openModal = (selectedMatch: DirectConfrontationMatch) => {
    setSelectedMatch(selectedMatch);
  };

  const closeModal = () => {
    setSelectedMatch(null);
  };

  const handleSaveWinner = (winner: string) => {
    setMatches(prevMatches =>
      prevMatches.map(match =>
        match.id === selectedMatch?.id
          ? {
              ...match,
              winner_team_id: winner === `Equipe ${match.team1_id}` ? match.team1_id : match.team2_id,
            }
          : match
      )
    );
    closeModal();
    fetchMatches();

    showSnackbar('Resultado da partida salvo com sucesso!', 'success');
  };

  const handleGenerateMatches = () => {
    setShowTeamsList(true);
  };

  const handleCloseTeamsList = () => {
    setShowTeamsList(false);
  };

  const handleConfirmTeamsList = async (presentTeams: number[]) => {
    setShowTeamsList(false);

    try {
      await DirectConfrontationMatchService.deleteDirectConfrontationMatches(Number(competitionId), Number(gameId));

      const payload: DirectConfrontationMatchPayload = {
        competition_id: Number(competitionId),
        game_id: Number(gameId),
        teams: presentTeams,
      };

      await DirectConfrontationMatchService.createDirectConfrontationMatches(payload);

      const response = await DirectConfrontationMatchService.getDirectConfrontationMatches(Number(competitionId), Number(gameId));
      setMatches(response.directConfrontationMatches);

      showSnackbar('Chaveamento gerado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao criar ou buscar partidas:', error);
      showSnackbar('Erro ao gerar chaveamento. Tente novamente.', 'error');
    }
  };

  const calculateTop = (round: number, matchIndex: number, previousRoundTops: number[]): number => {
    const baseSpacing = 100;

    if (round === 1) {
      return matchIndex * baseSpacing;
    }

    const previousMatchTop1 = previousRoundTops[matchIndex * 2] ?? 0;
    const previousMatchTop2 = previousRoundTops[matchIndex * 2 + 1] ?? 0;

    return (previousMatchTop1 + previousMatchTop2) / 2;
  };

  const renderBracket = () => {
    if (!matches || matches.length === 0) {
      return <div className="no-matches">Sem partidas criadas</div>;
    }

    const rounds = Array.from(new Set(matches.map(match => match.round)));
    const previousRoundsTops: { [key: number]: number[] } = {};

    return (
      <div className="bracket-container">
        <div className="bracket">
          <div className="rounds">
            {rounds.map((round, roundIndex) => (
              <div key={round} className={`round round-${round}`}>
                <h2>Round {round}</h2>
                <div className="matches">
                  {matches
                    .filter(match => match.round === round)
                    .map((match, index) => {
                      const previousRoundTops = previousRoundsTops[round - 1] || [];
                      let topValue = calculateTop(round, index, previousRoundTops);

                      if (!previousRoundsTops[round]) {
                        previousRoundsTops[round] = [];
                      }
                      previousRoundsTops[round].push(topValue);

                      const exitClass = index % 2 === 0 ? 'exit down' : 'exit up';
                      const entryClass = exitClass === 'exit down' ? 'entry down' : 'entry up';
                      const exitHeight = 35 + 50 * (Math.pow(2, roundIndex) - 1);
                      const isLastRound = roundIndex === rounds.length - 1;

                      if (isLastRound && match.match === 2) {
                        const finalMatchTop = previousRoundsTops[round][0];
                        topValue = finalMatchTop + 150;
                      }

                      const team1Class = match.winner_team_id === null ? '' : (match.winner_team_id === match.team1_id ? 'winner' : 'loser');
                      const team2Class = match.winner_team_id === null ? '' : (match.winner_team_id === match.team2_id ? 'winner' : 'loser');

                      return (
                        <div
                          key={match.id}
                          className="match"
                          style={{ top: `${topValue}px` }}
                          onClick={() => openModal(match)}
                        >
                          <div className={`team ${team1Class}`}>{match.team1_name || (round === 1 ? 'BYE' : 'A definir')}</div>
                          <div className="vs">x</div>
                          <div className={`team ${team2Class}`}>{match.team2_name || (round === 1 ? 'BYE' : 'A definir')}</div>

                          {!isLastRound && (
                            <div className={exitClass} style={{ height: `${exitHeight}px` }}>
                              <div className={entryClass}></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <h1>Prova A</h1>
      <div className="generate-matches-container">
        <h3>Confronto Direto</h3>
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
      {renderBracket()}
      {selectedMatch && (
        <MatchWinnerModal
          competitionId={Number(competitionId)}
          gameId={Number(gameId)}
          team1Id={selectedMatch.team1_id || 0}
          team2Id={selectedMatch.team2_id || 0}
          team1Name={selectedMatch.team1_name || 'Unknown Team 1'}
          team2Name={selectedMatch.team2_name || 'Unknown Team 2'}
          matchId={selectedMatch.id}
          onClose={closeModal}
          onSaveWinner={handleSaveWinner}
        />
      )}
    </div>
  );
};

export default DirectConfrontationMatches;
