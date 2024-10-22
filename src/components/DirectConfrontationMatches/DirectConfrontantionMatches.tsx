import React, { useState } from 'react';
import './DirectConfrontationMatches.css';
import MatchWinnerModal from '../DirectConfrontationMatchWinner/DirectConfrontationMatchWinner';
import PresentTeamsList from '../PresentTeamsList/PresentTeamsList';

interface Team {
  id: number;
  name: string;
  isPresent: boolean;
}

const DirectConfrontationMatches: React.FC = () => {
  const [matches, setMatches] = useState<
    { id: number; round: number; match: number; team1_id: number; team2_id: number; winner_team_id: number | null }[]
  >([
    { id: 158, round: 1, match: 1, team1_id: 1, team2_id: 5, winner_team_id: null },
    { id: 159, round: 1, match: 2, team1_id: 9, team2_id: 13, winner_team_id: null },
    { id: 160, round: 1, match: 3, team1_id: 17, team2_id: 21, winner_team_id: null },
    { id: 161, round: 1, match: 4, team1_id: 25, team2_id: 29, winner_team_id: null },

    { id: 162, round: 2, match: 1, team1_id: 1, team2_id: 9, winner_team_id: null },
    { id: 163, round: 2, match: 2, team1_id: 17, team2_id: 25, winner_team_id: null },

    { id: 164, round: 3, match: 1, team1_id: 1, team2_id: 17, winner_team_id: null },
    { id: 165, round: 3, match: 2, team1_id: 1, team2_id: 17, winner_team_id: null },
  ]);

  const [selectedMatch, setSelectedMatch] = useState<{ team1: string, team2: string, matchId: number } | null>(null);
  const [showTeamsList, setShowTeamsList] = useState(false); // Controla a exibição da lista de equipes
  const [presentTeams, setPresentTeams] = useState<Team[]>([]); // Armazena as equipes presentes

  const openModal = (matchId: number, team1: string, team2: string) => {
    setSelectedMatch({ team1, team2, matchId });
  };

  const closeModal = () => {
    setSelectedMatch(null);
  };

  const handleSaveWinner = (winner: string) => {
    setMatches(prevMatches =>
      prevMatches.map(match =>
        match.id === selectedMatch?.matchId
          ? {
              ...match,
              winner_team_id: winner === `Equipe ${match.team1_id}` ? match.team1_id : match.team2_id,
            }
          : match
      )
    );
    closeModal();
  };
  
  const handleGenerateMatches = () => {
    setShowTeamsList(true);
  };

  const handleCloseTeamsList = () => {
    setShowTeamsList(false);
  };

  const handleConfirmTeamsList = (presentTeams: Team[]) => {
    setPresentTeams(presentTeams); 
    setShowTeamsList(false);
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

                      const team1Class = match.winner_team_id === match.team1_id ? 'winner' : match.winner_team_id === null ? '' : 'loser';
                      const team2Class = match.winner_team_id === match.team2_id ? 'winner' : match.winner_team_id === null ? '' : 'loser';

                      return (
                        <div
                          key={match.id}
                          className="match"
                          style={{ top: `${topValue}px` }}
                          onClick={() => openModal(match.id, `Equipe ${match.team1_id}`, `Equipe ${match.team2_id}`)}
                        >
                          <div className={`team ${team1Class}`}>Equipe {match.team1_id}</div>
                          <div className="vs">x</div>
                          <div className={`team ${team2Class}`}>Equipe {match.team2_id}</div>

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
      {showTeamsList && <PresentTeamsList onClose={handleCloseTeamsList} onConfirm={handleConfirmTeamsList} />}
      {renderBracket()}
      {selectedMatch && (
        <MatchWinnerModal
          team1={selectedMatch.team1}
          team2={selectedMatch.team2}
          onClose={closeModal}
          onSaveWinner={handleSaveWinner}
        />
      )}
    </div>
  );
};

export default DirectConfrontationMatches;
