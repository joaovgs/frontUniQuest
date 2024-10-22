import React, { useState } from 'react';
import './PresentTeamsList.css';

interface Team {
  id: number;
  name: string;
  isPresent: boolean;
}

interface PresentTeamsListProps {
  onClose: () => void;
  onConfirm: (presentTeams: Team[]) => void; 
}

const PresentTeamsList: React.FC<PresentTeamsListProps> = ({ onClose, onConfirm }) => {
  const [teams, setTeams] = useState<Team[]>([
    { id: 1, name: 'Equipe 1', isPresent: true },
    { id: 2, name: 'Equipe 2', isPresent: true },
    { id: 3, name: 'Equipe 3', isPresent: true },
    { id: 4, name: 'Equipe 4', isPresent: false },
    { id: 5, name: 'Equipe 5', isPresent: true },
    { id: 6, name: 'Equipe 6', isPresent: true },
    { id: 7, name: 'Equipe 7', isPresent: false },
    { id: 8, name: 'Equipe 8', isPresent: false },
    { id: 9, name: 'Equipe 9', isPresent: true },
    { id: 10, name: 'Equipe 10', isPresent: false }
  ]);

  const toggleTeamPresence = (id: number) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === id ? { ...team, isPresent: !team.isPresent } : team
      )
    );
  };

  const isAnyTeamPresent = teams.some(team => team.isPresent);

  const handleConfirm = () => {
    const presentTeams = teams.filter((team: Team) => team.isPresent); 
    onConfirm(presentTeams); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Equipes Presentes</h2>
        <ul className="team-list">
          {teams.map((team) => (
            <li key={team.id} className="team-item">
              <div className="team-row">
                <span className="team-name">{team.name}</span>
                <label>
                  <input
                    type="checkbox"
                    checked={team.isPresent}
                    onChange={() => toggleTeamPresence(team.id)}
                  />
                </label>
              </div>
            </li>
          ))}
        </ul>
        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>Cancelar</button>
          <button 
            className="confirm-button" 
            onClick={handleConfirm} 
            disabled={!isAnyTeamPresent} 
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresentTeamsList;
