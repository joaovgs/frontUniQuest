import React, { useState, useEffect, useCallback } from 'react';
import './TeamApproval.css';
import { TeamMemberService } from '../../services/TeamMember'; 
import { useSnackbar } from '../../context/SnackbarContext';
import Spinner from '../Spinner/Spinner'; 
import { TeamService } from '../../services/Team';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

interface ApprovalModalProps {
  teamId: number; 
  teamName: string;
  status: string;
  memberCount: string;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onClose: () => void;
  competitionId: number;
  userTeamId: number | null;
}

const ApprovalModal: React.FC<ApprovalModalProps> = ({ teamId, teamName, status, memberCount, onApprove, onReject, onClose, competitionId, userTeamId }) => {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [members, setMembers] = useState<string[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 
  const { showSnackbar } = useSnackbar(); 
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<'approve' | 'reject' | null>(null);

  const fetchTeamMembers = useCallback(async () => {
    setLoading(true); 
    try {
      const response = await TeamMemberService.getTeamMembers(teamId); 
      const teamMembers = response.teamMembers.map(member => member.user_name); 
      setMembers(teamMembers); 
    } catch (error) {
      console.error('Erro ao buscar membros da equipe:', error);
      showSnackbar('Erro ao carregar os membros da equipe. Tente novamente.', 'error');
    } finally {
      setLoading(false); 
    }
  }, [teamId]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]); 

  const handleApprove = () => {
    setActionToConfirm('approve');
    setIsConfirmationModalOpen(true);
  };

  const handleReject = () => {
    if (!showRejectReason) {
      setShowRejectReason(true);
    } else if (rejectReason.trim() === '') {
      showSnackbar('O motivo da rejeição é obrigatório.', 'error');
    } else {
      setActionToConfirm('reject');
      setIsConfirmationModalOpen(true);
    }
  };

  const confirmAction = async () => {
    if (actionToConfirm === 'approve') {
      try {
        await TeamService.updateStatus(teamId, { status: 1 });
        showSnackbar('Equipe aprovada com sucesso!', 'success');
        onApprove();
      } catch (error) {
        console.error('Erro ao aprovar equipe:', error);
        showSnackbar('Erro ao aprovar a equipe. Tente novamente.', 'error');
      }
    } else if (actionToConfirm === 'reject') {
      try {
        await TeamService.updateStatus(teamId, { status: -1, message: rejectReason });
        showSnackbar('Equipe rejeitada com sucesso!', 'success');
        onReject(rejectReason);
      } catch (error) {
        console.error('Erro ao rejeitar equipe:', error);
        showSnackbar('Erro ao rejeitar a equipe. Tente novamente.', 'error');
      }
    }
    setIsConfirmationModalOpen(false);
    setActionToConfirm(null);
  };

  return (
    <div className="approval-modal-overlay">
      <div className="approval-modal-content">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className={`team-status ${status.toLowerCase()}`}>
              {status} ({memberCount})
            </div>
            <h2>{teamName}</h2>            

            <div className="participants-section">
              <ul className="participants-list">
                {members.length > 0 ? (
                  members.map((member, index) => (
                    <li key={index} className="participant-item">{member}</li>
                  ))
                ) : (
                  <p>Nenhum membro encontrado.</p>
                )}
              </ul>
            </div>

            {showRejectReason && (
              <textarea
                className="reject-reason-input"
                placeholder="Motivo da Rejeição (será enviado para o e-mail dos membros da equipe)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              />
            )}

            <div className="modal-actions">
              <button className="close-button" onClick={onClose}>Cancelar</button>
              <button className="approve-button" onClick={handleApprove}>Aprovar</button>
              <button className="reject-button" onClick={handleReject}>
                {showRejectReason ? 'Confirmar' : 'Rejeitar'}
              </button>              
            </div>
            <ConfirmationModal
              isOpen={isConfirmationModalOpen}
              message={`Tem certeza de que deseja ${actionToConfirm === 'approve' ? 'aprovar' : 'rejeitar'} esta equipe?`}
              onConfirm={confirmAction}
              onCancel={() => setIsConfirmationModalOpen(false)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ApprovalModal;
