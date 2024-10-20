import React from 'react';
import './TeamParticipants.css';

interface TeamParticipantsProps {
  teamName: string;
  participants: string[];
  status: 'Aberta' | 'Fechada';
  memberCount: string;
  onJoin: () => void;
  onCancel: () => void;
}

const TeamParticipants: React.FC<TeamParticipantsProps> = ({ teamName, participants, status, memberCount, onJoin, onCancel }) => {
  return (
    <div className="team-participants-modal">
      <div className="modal-content">
        <div className={`team-status ${status === 'Fechada' ? 'closed' : 'opened'}`}>
          {status} ({memberCount})
        </div>
        <h2>{teamName}</h2>
        
        <ul className="participants-list">
          {participants.map((participant, index) => (
            <li key={index} className="participant-item">
              {participant}
            </li>
          ))}
        </ul>
        
        <div className="participants-actions">
          <button className="cancelbutton" onClick={onCancel}>Cancelar</button>
          <button className="joinbutton" onClick={onJoin}>Entrar</button>
        </div>
      </div>
    </div>
  );
};

export default TeamParticipants;
