import React, { useState } from 'react';
import './TeamList.css';
import TeamCreate from '../TeamCreate/TeamCreate';
import TeamParticipants from '../TeamParticipants/TeamParticipants';

interface Participant {
  name: string;
}

interface Team {
  name: string;
  memberCount: string;
  status: 'Aberta' | 'Fechada';
  participants: Participant[];
  password?: string;
}

const TeamList: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([
    {
      name: 'Equipe A',
      memberCount: '5/10',
      status: 'Aberta',
      participants: [
        { name: 'John' },
        { name: 'Jane' },
      ],
    },
    {
      name: 'Equipe B',
      memberCount: '8/10',
      status: 'Fechada',
      participants: [
        { name: 'Mark' },
        { name: 'Emma' },
      ],
    },
  ]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

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
        participants: [],
        password: teamData.password,
      },
    ]);
    setShowCreateModal(false);
  };

  const handleShowParticipants = (team: Team) => {
    setSelectedTeam(team);
    setShowParticipantsModal(true);
  };

  const handleCloseParticipantsModal = () => {
    setShowParticipantsModal(false);
    setSelectedTeam(null);
  };

  return (
    <div className="team-list-container">
      <h1>Lista de Equipes</h1>
      <input type="text" placeholder="Pesquisar equipes..." className="search-input" />
      <div className="teams-grid">
        {teams.map((team, index) => (
          <div key={index} className="team-card" onClick={() => handleShowParticipants(team)}>
            <div className={`team-status ${team.status === 'Fechada' ? 'closed' : 'opened'}`}>
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
      {showCreateModal && <TeamCreate onClose={() => setShowCreateModal(false)} onSave={handleSaveTeam} />}
      {showParticipantsModal && selectedTeam && (
        <TeamParticipants
          teamName={selectedTeam.name}
          participants={selectedTeam.participants.map((participant) => participant.name)}
          status={selectedTeam.status}
          memberCount={selectedTeam.memberCount}
          onJoin={() => console.log('Entrar na equipe')}
          onCancel={handleCloseParticipantsModal}
        />
      )}
    </div>
  );
};

export default TeamList;
