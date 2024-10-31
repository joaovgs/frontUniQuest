import React, { useState } from 'react';
import './DirectConfrontationMatchWinner.css';
import { DirectConfrontationMatchService } from '../../services/DirectConfrontationMatch';
import { FaTimes, FaCheck } from 'react-icons/fa';

interface DirectConfrontationMatchWinnerProps {
  onClose: () => void;
  onSaveWinner: (winner: string) => void | Promise<void>;
  team1Id: number;
  team1Name: string;
  team2Id: number;
  team2Name: string;
  matchId: number;
  competitionId: number;
  gameId: number;
}

const DirectConfrontationMatchWinner: React.FC<DirectConfrontationMatchWinnerProps> = ({
  onClose, onSaveWinner, team1Id, team1Name, team2Id, team2Name, matchId, competitionId, gameId
}) => {
  const [selectedWinner, setSelectedWinner] = useState<number | null>(null);

  const handleSave = async () => {
    if (selectedWinner !== null) {
      try {
        await DirectConfrontationMatchService.updateWinnerDirectConfrontationMatch(matchId, competitionId, gameId, selectedWinner);
        onSaveWinner(selectedWinner === team1Id ? team1Name : team2Name);
      } catch (error) {
        console.error('Erro ao definir vencedor:', error);
      }
    }
  };

  return (
    <div className="match-winner-container">
      <div className="winner-modal">
        <h2>Definir Vencedor</h2>
        <div className="teams-options">
          <button
            className={`team-button ${selectedWinner === team1Id ? 'selected' : ''}`}
            onClick={() => setSelectedWinner(team1Id)}
          >
            {team1Name}
          </button>
          <span className="vs-text">x</span>
          <button
            className={`team-button ${selectedWinner === team2Id ? 'selected' : ''}`}
            onClick={() => setSelectedWinner(team2Id)}
          >
            {team2Name}
          </button>
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
            <FaTimes style={{ marginRight: '8px' }} />
            Cancelar
          </button>
          <button className="save-button" onClick={handleSave} disabled={selectedWinner === null}>
            <FaCheck style={{ marginRight: '8px' }} />
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DirectConfrontationMatchWinner;
