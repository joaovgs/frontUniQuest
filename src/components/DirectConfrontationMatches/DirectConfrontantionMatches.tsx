import React from 'react';
import './DirectConfrontationMatches.css'; // Import the CSS file

const DirectConfrontationMatches: React.FC = () => {
  const matches = [
    { id: 134, round: 1, match: 1, team1_id: 7, team2_id: 6, winner_team_id: 7 },
    { id: 135, round: 1, match: 2, team1_id: 4, team2_id: 2, winner_team_id: 4 },
    { id: 136, round: 1, match: 3, team1_id: 1, team2_id: 8, winner_team_id: 1 },
    { id: 137, round: 1, match: 4, team1_id: 3, team2_id: 5, winner_team_id: 3 },
    { id: 138, round: 2, match: 1, team1_id: 7, team2_id: 4, winner_team_id: 7 },
    { id: 139, round: 2, match: 2, team1_id: 1, team2_id: 3, winner_team_id: 1 },
    { id: 140, round: 3, match: 1, team1_id: 7, team2_id: 1, winner_team_id: 7 },
    { id: 141, round: 3, match: 2, team1_id: 4, team2_id: 3, winner_team_id: 4 },
  ];

  // Função com tipagem correta em TypeScript
  const calculateTop = (round: number, matchIndex: number, previousRoundTops: number[]): number => {
    const baseSpacing = 120;

    if (round === 1) {
      return matchIndex * baseSpacing;
    }

    // Encontra o top das duas partidas da rodada anterior correspondentes a esta partida
    const previousMatchTop1 = previousRoundTops[matchIndex * 2] ?? 0;
    const previousMatchTop2 = previousRoundTops[matchIndex * 2 + 1] ?? 0;

    // Retorna o top como a média das duas partidas da rodada anterior
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

                      // Verifica se a partida é ímpar ou par para definir a classe exit
                      const exitClass = index % 2 === 0 ? 'exit down' : 'exit up';
                      const entryClass = exitClass === 'exit down' ? 'entry down' : 'entry up';

                      // Calcula a altura de acordo com a rodada usando a lógica exponencial
                      const exitHeight = 35 + 60 * (Math.pow(2, roundIndex) - 1);

                      // Verifica se é a última rodada para não renderizar a exit class
                      const isLastRound = roundIndex === rounds.length - 1;
                      
                      if (isLastRound && match.match === 2) {
                        // Se for a disputa de 3º lugar, ajusta o topValue com 150px abaixo do final
                        const finalMatchTop = previousRoundsTops[round][0]; // Pega o topValue do 1º jogo (final)
                        topValue = finalMatchTop + 150;
                      }                      

                      return (
                        <div key={match.id} className="match" style={{ top: `${topValue}px` }}>
                          <div className={`team ${match.winner_team_id === match.team1_id ? 'winner' : 'loser'}`}>
                            Equipe {match.team1_id}
                          </div>
                          <div className="vs">vs</div>
                          <div className={`team ${match.winner_team_id === match.team2_id ? 'winner' : 'loser'}`}>
                            Equipe {match.team2_id}
                          </div>

                          {/* Condicional para não renderizar exit na última rodada */}
                          {!isLastRound && (
                            <div className={exitClass} style={{ height: `${exitHeight}px` }}>
                              {/* Div de entrada dentro da div de saída */}
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
      <h1>Confrontos Diretos</h1>
      {renderBracket()}
    </div>
  );
};

export default DirectConfrontationMatches;
