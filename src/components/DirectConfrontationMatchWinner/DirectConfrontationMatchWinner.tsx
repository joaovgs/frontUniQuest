import React, { useState } from 'react';
import './DirectConfrontationMatchWinner.css';

interface DirectConfrontationMatchWinnerProps {
  onClose: () => void;
  onSaveWinner: (winner: string) => void | Promise<void>;
  team1: string;
  team2: string;
}

const DirectConfrontationMatchWinner: React.FC<DirectConfrontationMatchWinnerProps> = ({ onClose, onSaveWinner, team1, team2 }) => {
  const [selectedWinner, setSelectedWinner] = useState<string>('');

  const handleSave = () => {
    if (selectedWinner) {
      onSaveWinner(selectedWinner);
    }
  };

  return (
    <div className="match-winner-container">
      <div className="winner-modal">
        <h2>Definir Vencedor</h2>
        <div className="teams-options">
          <button
            className={`team-button ${selectedWinner === team1 ? 'selected' : ''}`}
            onClick={() => setSelectedWinner(team1)}
          >
            {team1}
          </button>
          <span className="vs-text">x</span>
          <button
            className={`team-button ${selectedWinner === team2 ? 'selected' : ''}`}
            onClick={() => setSelectedWinner(team2)}
          >
            {team2}
          </button>
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancelar
          </button>
          <button className="save-button" onClick={handleSave} disabled={!selectedWinner}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectConfrontationMatchWinner;
