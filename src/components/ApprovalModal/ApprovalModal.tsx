import React, { useState } from 'react';
import './ApprovalModal.css';

interface Participant {
  name: string;
}

interface ApprovalModalProps {
  teamName: string;
  participants: Participant[];
  onApprove: () => void;
  onReject: (reason: string) => void;
  onClose: () => void;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ teamName, participants, onApprove, onReject, onClose }) => {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleReject = () => {
    if (showRejectReason) {
      onReject(rejectReason);
    } else {
      setShowRejectReason(true);
    }
  };

  return (
    <div className="approval-modal-overlay">
      <div className="approval-modal-content">
        <h2>Aprovar/Rejeitar {teamName}</h2>

        {showRejectReason && (
          <textarea
            className="reject-reason-input"
            placeholder="Motivo da Rejeição (se necessário)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        )}

        <div className="participants-section">
          <h3>Integrantes da Equipe</h3>
          <ul className="participants-list">
            {participants.map((participant, index) => (
              <li key={index} className="participant-item">{participant.name}</li>
            ))}
          </ul>
        </div>

        <div className="modal-actions">
          <button className="approve-button" onClick={onApprove}>Aprovar</button>
          <button className="reject-button" onClick={handleReject}>Rejeitar</button>
          <button className="close-button" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalModal;
