import React, { useState } from 'react';
import './RankingPage.css'; // Arquivo de CSS para estilizar a tabela e layout

interface Team {
  name: string;
  scores: number[];
  total_score: number;
}

const RankingPage: React.FC = () => {
  // Registro de equipes com pontuações fictícias para visualização
  const [teams, setTeams] = useState<Team[]>([
    { name: 'Equipe 1', scores: [50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 400, 50, 50, 100, 400], total_score: 450 },
    { name: 'Equipe 2', scores: [50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 400, 50, 50, 100, 400], total_score: 400 },
    { name: 'Equipe 3', scores: [50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 400, 50, 50, 100, 400], total_score: 400 },
    { name: 'Equipe 4', scores: [50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 400, 50, 50, 100, 400], total_score: 200 },
    { name: 'Equipe 4', scores: [50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 400, 50, 50, 100, 400], total_score: 200 },
    { name: 'Equipe 4', scores: [50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 400, 50, 50, 100, 400], total_score: 200 },
    { name: 'Equipe 4', scores: [50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 400, 50, 50, 100, 400], total_score: 200 },
    { name: 'Equipe 4', scores: [50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 400, 50, 50, 100, 400], total_score: 500 },
    { name: 'Equipe 4', scores: [50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 400, 50, 50, 100, 400], total_score: 200 },
    { name: 'Equipe 4', scores: [50, 50, 100, 50, 50, 100, 50, 50, 100, 50, 50, 100, 400, 50, 50, 100, 400], total_score: 200 },
  ]);

  return (
    <div className="ranking-container">
      <header>
        <div className="logo" onClick={() => window.location.href = '/'}>
          <img src="/path-to-logo.png" alt="Logo" />
        </div>
        <button className="login-button">Entrar</button>
      </header>

      <h1>GINCANA 2024</h1>

      <table className="ranking-table">
        <thead>
          <tr>
            <th>Ranking</th>
            <th>Equipe</th>
            <th>Prova A</th>
            <th>Prova B</th>
            <th>Prova C</th>
            <th>Prova C</th>
            <th>Prova C</th>
            <th>Prova C</th>
            <th>Prova C</th>
            <th>Prova C</th>
            <th>Prova C</th>
            <th>Prova C</th>
            <th>Prova C</th>
            <th>Prova C</th>
            <th>Prova C</th>
            <th>Prova C</th>
            <th>Prova C</th>
            <th>Prova C</th>
            <th>Prova C</th>
            <th>Geral</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, index) => (
            <tr key={team.name}>
              <td>{index + 1}º</td>
              <td>{team.name}</td>
              {team.scores.map((score, i) => (
                <td key={i}>{score}</td>
              ))}
              <td>{team.total_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RankingPage;
