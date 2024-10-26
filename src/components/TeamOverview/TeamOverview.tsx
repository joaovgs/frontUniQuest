import React, { useState } from 'react';
import './TeamOverview.css';

interface Team {
  name: string;
  memberCount: string;
  status: 'Pendente' | 'Aprovada' | 'Rejeitada';
}

const TeamOverview: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([
    { name: 'Equipe 1', memberCount: '3/10', status: 'Pendente' },
    { name: 'Equipe 2', memberCount: '6/10', status: 'Aprovada' },
    { name: 'Equipe 3', memberCount: '2/10', status: 'Rejeitada' },
  ]);

  return (
    <div className="team-overview-container">
      <h1>Visão Geral das Equipes</h1>
      <div className="teams-grid">
        {teams.map((team, index) => (
          <div key={index} className="team-card">
            <div className={`team-status ${team.status.toLowerCase()}`}>
              {team.status}
            </div>
            <h3>{team.name}</h3>
            <p>{team.memberCount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamOverview;
