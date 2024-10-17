import React, { useState } from 'react';
import './TeamCreate.css';

interface TeamCreateProps {
  onClose: () => void;
  onSave: (teamData: { name: string; status: 'Aberta' | 'Fechada'; password?: string }) => void;
}

const TeamCreate: React.FC<TeamCreateProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'Aberta' | 'Fechada'>('Aberta');
  const [password, setPassword] = useState('');

  const handleSave = () => {
    const teamData = { name, status, password: status === 'Fechada' ? password : undefined };
    onSave(teamData);
  };

  return (
    <div className="team-create-modal">
      <div className="modal-content">
        <h2>Criar Nova Equipe</h2>
        <input
          type="text"
          placeholder="Nome da Equipe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="team-input"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value as 'Aberta' | 'Fechada')} className="team-select">
          <option value="Aberta">Aberta</option>
          <option value="Fechada">Fechada</option>
        </select>
        {status === 'Fechada' && (
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="team-input"
          />
        )}
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-button">Cancelar</button>
          <button onClick={handleSave} className="save-button">Salvar</button>
        </div>
      </div>
    </div>
  );
};

export default TeamCreate;
