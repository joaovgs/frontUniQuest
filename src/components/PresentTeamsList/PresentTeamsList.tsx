import React, { useState, useEffect } from 'react';
import './PresentTeamsList.css';
import { TeamService } from '../../services/Team';
import { Team } from '../../models/Team';

interface PresentTeamsListProps {
  competitionId: number; 
  onClose: () => void;
  onConfirm: (presentTeamIds: number[]) => void; 
}

interface TeamWithPresence extends Team {
  isPresent: boolean;
}

const PresentTeamsList: React.FC<PresentTeamsListProps> = ({ competitionId, onClose, onConfirm }) => {
  const [teams, setTeams] = useState<TeamWithPresence[]>([]);

  useEffect(() => {
    const fetchRegisteredTeams = async () => {
      try {
        const response = await TeamService.getTeamsRegistered(competitionId);
        setTeams(response.teams.map((team: Team) => ({ ...team, isPresent: true })));
      } catch (error) {
        console.error('Erro ao buscar equipes registradas:', error);
      }
    };

    fetchRegisteredTeams();
  }, [competitionId]);

  const toggleTeamPresence = (id: number) => {
    setTeams((prevTeams) =>
      prevTeams.map((team) =>
        team.id === id ? { ...team, isPresent: !team.isPresent } : team
      )
    );
  };

  const isAnyTeamPresent = teams.some(team => team.isPresent);

  const handleConfirm = () => {
    const presentTeamIds = teams
      .filter((team: TeamWithPresence) => team.isPresent)
      .map((team: TeamWithPresence) => team.id);
      console.log(presentTeamIds)
    onConfirm(presentTeamIds); 
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Equipes Presentes</h2>
        <ul className="team-list">
          {teams.map((team) => (
            <li key={team.id} className="present-team-item">
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
