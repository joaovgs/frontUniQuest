import React, { useState } from 'react';
import './TeamOverview.css';
import ApprovalModal from '../ApprovalModal/ApprovalModal';

interface Participant {
  name: string;
}

interface Team {
  name: string;
  memberCount: string;
  status: 'Pendente' | 'Aprovada' | 'Rejeitada';
  participants: Participant[]; // Adiciona participants na estrutura Team
}

const TeamOverview: React.FC = () => {
  const [teams, setTeams] = useState<Team[]>([
    { name: 'Equipe 1', memberCount: '4/10', status: 'Pendente', participants: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Carol' }, { name: 'David' }] },
    { name: 'Equipe 2', memberCount: '6/10', status: 'Aprovada', participants: [{ name: 'Eve' }, { name: 'Frank' }] },
    { name: 'Equipe 3', memberCount: '2/10', status: 'Rejeitada', participants: [{ name: 'Grace' }, { name: 'Heidi' }] }
  ]);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const handleOpenApprovalModal = (team: Team) => {
    setSelectedTeam(team);
    setShowApprovalModal(true);
  };

  const handleApproveTeam = (teamName: string) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.name === teamName ? { ...team, status: 'Aprovada' } : team
      )
    );
    setShowApprovalModal(false);
  };

  const handleRejectTeam = (teamName: string, reason: string) => {
    console.log(`Motivo da Rejeição para ${teamName}: ${reason}`);
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.name === teamName ? { ...team, status: 'Rejeitada' } : team
      )
    );
    setShowApprovalModal(false);
  };

  const handleCloseApprovalModal = () => {
    setShowApprovalModal(false);
    setSelectedTeam(null);
  };

  return (
    <div className="team-overview-container">
      <h1>Visão Geral das Equipes</h1>
      <div className="teams-grid">
        {teams.map((team, index) => (
          <div key={index} className="team-card" onClick={() => handleOpenApprovalModal(team)}>
            <div className={`team-status ${team.status.toLowerCase()}`}>
              {team.status}
            </div>
            <h3>{team.name}</h3>
            <p>{team.memberCount}</p>
          </div>
        ))}
      </div>
      {showApprovalModal && selectedTeam && (
        <ApprovalModal
          teamName={selectedTeam.name}
          participants={selectedTeam.participants}
          onApprove={() => handleApproveTeam(selectedTeam.name)}
          onReject={(reason) => handleRejectTeam(selectedTeam.name, reason)}
          onClose={handleCloseApprovalModal}
        />
      )}
    </div>
  );
};

export default TeamOverview;
