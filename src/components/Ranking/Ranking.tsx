import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Ranking.css'; 
import { ScoreService } from '../../services/Score';
import { CompetitionService } from '../../services/Competition';
import { Ranking } from '../../models/Score';
import Spinner from '../Spinner/Spinner'; 

const RankingPage: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const [ranking, setRanking] = useState<Ranking[]>([]);
  const [gameNames, setGameNames] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' | null } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const updateAndFetchScores = async () => {
      setLoading(true); 
      try {
        const competition = await CompetitionService.getById(Number(competitionId));
        
        if (competition?.competition?.CompetitionGames) {
          const gameIds = competition.competition.CompetitionGames.map(game => game.game_id);

          await Promise.all(gameIds.map(gameId => ScoreService.updateScore(Number(competitionId), gameId)));

          const response = await ScoreService.getScoresByCompetitionId(Number(competitionId));
          setRanking(response.ranking);
          console.log(response.ranking);

          if (response.ranking.length > 0) {
            const uniqueGameNames = Array.from(new Set(response.ranking.flatMap(team => team.scores.map(score => score.game_name))));
            setGameNames(uniqueGameNames);
          }
        } else {
          console.error('CompetitionGames is undefined');
        }
      } catch (error) {
        console.error('Erro ao atualizar e buscar pontuações:', error);
      } finally {
        setLoading(false);
      }
    };

    if (competitionId) {
      updateAndFetchScores();
    }
  }, [competitionId]);

  const sortedTeams = React.useMemo(() => {
    if (sortConfig && sortConfig.direction !== null) {
      return [...ranking].sort((a, b) => {
        if (sortConfig.key === 'total_score') {
          return sortConfig.direction === 'asc' ? a.total_score - b.total_score : b.total_score - a.total_score;
        } else {
          const scoreA = a.scores.find(score => score.game_name === sortConfig.key)?.score || 0;
          const scoreB = b.scores.find(score => score.game_name === sortConfig.key)?.score || 0;
          return sortConfig.direction === 'asc' ? scoreA - scoreB : scoreB - scoreA;
        }
      });
    }
    return ranking;
  }, [ranking, sortConfig]);

  const requestSort = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      setSortConfig({ key, direction: 'desc' });
    } else if (sortConfig.direction === 'desc') {
      setSortConfig({ key, direction: 'asc' });
    } else if (sortConfig.direction === 'asc') {
      setSortConfig(null);
    }
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key || sortConfig.direction === null) return null;
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  return (
    <>
      <div className="ranking-container">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <h1>Ranking</h1>
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>Ranking</th>
                  <th>Equipe</th>
                  {gameNames.map((gameName, index) => (
                    <th key={index} onClick={() => requestSort(gameName)}>
                      {gameName} {getSortIcon(gameName)}
                    </th>
                  ))}
                  <th onClick={() => requestSort('total_score')}>
                    Geral {getSortIcon('total_score')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedTeams.map((team, index) => (
                  <tr key={team.team_id}>
                    <td>{index + 1}º</td>
                    <td>{team.team_name}</td>
                    {gameNames.map((gameName, i) => {
                      const score = team.scores.find(score => score.game_name === gameName);
                      return <td key={i}>{score ? score.score : '-'}</td>;
                    })}
                    <td>{team.total_score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
};

export default RankingPage;
