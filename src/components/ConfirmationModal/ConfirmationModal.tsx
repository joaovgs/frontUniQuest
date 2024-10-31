import React from 'react';
import './ConfirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="confirmation-modal">
        <p>{message}</p>
        <div className="modal-actions">
          <button className="no-button" onClick={onCancel}>
            Não
          </button>
          <button className="yes-button" onClick={onConfirm}>
            Sim
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
