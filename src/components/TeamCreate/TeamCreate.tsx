import React, { useState } from 'react';
import './TeamCreate.css';
import { TeamPayload } from '../../models/Team';

interface TeamCreateProps {
  onClose: () => void;
  onSave: (team: TeamPayload) => void | Promise<void>;
  competitionId: number;
}

const TeamCreate: React.FC<TeamCreateProps> = ({ onClose, onSave, competitionId }) => {
  const [name, setName] = useState<string>(''); 
  const [isPrivate, setIsPrivate] = useState<number>(0); 
  const [password, setPassword] = useState<string>(''); 

  const handleSave = () => {
    const newTeam: TeamPayload = {
      name,
      is_private: isPrivate, 
      competition_id: competitionId,
      leader_user_id: 1, // Ajuste conforme necessário
      password: isPrivate === 1 ? password : undefined,
    };
    onSave(newTeam);
  };

  return (
    <div className="team-create-container">
      <div className="create-team-modal">
        <h2>Cadastro de Equipe</h2>
        <form className="form-inline">
          <input
            type="text"
            placeholder="Nome da Equipe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="team-input"
          />

          <div className="status-password-wrapper">
            <div className="status-select">
              <label>Status</label>
              <select
                value={isPrivate} 
                onChange={(e) => setIsPrivate(Number(e.target.value))}
                className="team-select"
              >
                <option value="0">Pública</option>
                <option value="1">Privada</option>
              </select>
            </div>

            <div className="password-input">
              <input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPrivate === 0} 
                className="team-password-input"
              />
            </div>
          </div>
        </form>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancelar
          </button>
          <button className="save-button" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamCreate;
