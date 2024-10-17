import React, { useState } from 'react';
import './TeamList.css';
import TeamCreate from '../TeamCreate/TeamCreate';

interface Team {
  name: string;
  memberCount: string;
  status: 'Aberta' | 'Fechada';
  password?: string;
}

const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreate = () => {
    setShowCreateModal(true);
  };

  const handleSaveTeam = (teamData: { name: string; status: 'Aberta' | 'Fechada'; password?: string }) => {
    setTeams((prevTeams) => [
      ...prevTeams,
      {
        name: teamData.name,
        memberCount: '0/10',
        status: teamData.status,
        password: teamData.password,
      },
    ]);
    setShowCreateModal(false);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  return (
    <div className="team-list-container">
      <h1>Lista de Equipes</h1>
      <input type="text" placeholder="Pesquisar equipes..." className="search-input" />
      <div className="teams-grid">
        {teams.map((team, index) => (
          <div key={index} className="team-card">
            <div className={`team-status ${team.status === 'Fechada' ? 'closed' : 'open'}`}>
              {team.status}
            </div>
            <h3>{team.name}</h3>
            <p>{team.memberCount}</p>
          </div>
        ))}
      </div>
      <div className="footer">
        <button className="create-team-button" onClick={handleCreate}>Criar</button>
      </div>
      {showCreateModal && <TeamCreate onClose={handleCloseModal} onSave={handleSaveTeam} />}
    </div>
  );
};

export default TeamList;
