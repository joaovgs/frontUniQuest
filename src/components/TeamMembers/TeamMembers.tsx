import React, { useState, useEffect, useCallback } from 'react';
import './TeamMembers.css';
import { TeamMemberService } from '../../services/TeamMember'; 
import { useSnackbar } from '../../context/SnackbarContext';
import { TeamMemberPayload } from '../../models/TeamMember';
import Spinner from '../Spinner/Spinner'; 
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { FaTimes, FaSignOutAlt, FaSignInAlt } from 'react-icons/fa'; // Importando ícones

interface TeamMembersProps {
  teamId: number; 
  teamName: string;
  status: 'Pública' | 'Privada';
  memberCount: string;
  onJoinOrLeave: () => void;
  onCancel: () => void;
  competitionId: number;
  userTeamId: number | null;
  minParticipant: number;
}

const TeamMembers: React.FC<TeamMembersProps> = ({ teamId, teamName, status, memberCount, onJoinOrLeave, onCancel, competitionId, userTeamId, minParticipant }) => {
  const [members, setMembers] = useState<string[]>([]); 
  const [password, setPassword] = useState<string>('');
  const [isUserMember, setIsUserMember] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); 
  const { showSnackbar } = useSnackbar(); 
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  const fetchTeamMembers = useCallback(async () => {
    if (isConfirmationModalOpen) {
      return;
    }
    setLoading(true); 
    try {
      const response = await TeamMemberService.getTeamMembers(teamId); 
      const teamMembers = response.teamMembers.map(member => member.user_name); 
      setMembers(teamMembers); 
      
      const userResponse = await TeamMemberService.getUserInCompetition(competitionId); 
      setIsUserMember(userResponse.team_id === teamId);
      
    } catch (error) {
      console.error('Erro ao buscar membros da equipe:', error);
      showSnackbar('Erro ao carregar os membros da equipe. Tente novamente.', 'error');
    } finally {
      setLoading(false); 
    }
  }, [teamId, competitionId]);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]); 

  const handleJoin = async () => {
    if (userTeamId !== null && userTeamId !== teamId) {
      showSnackbar('Você já está em uma equipe!', 'error');
      return;
    }

    const [currentCount, maxCount] = memberCount.split('/').map(Number);
    if (currentCount >= maxCount) {
      showSnackbar('A equipe está cheia. Não é possível entrar.', 'error');
      return;
    }

    try {
      const payload: TeamMemberPayload = { team_id: teamId }; 
      if (status === 'Privada') {
        payload.password = password;
      }
      await TeamMemberService.createTeamMember(payload);
      showSnackbar('Você entrou na equipe com sucesso!', 'success');
      onJoinOrLeave();
    } catch (error: any) {
      if (error.response && error.response.status === 403) {
        showSnackbar('Senha incorreta. Tente novamente.', 'error');
      } else {
        console.error('Erro ao entrar na equipe:', error);
        showSnackbar('Erro ao entrar na equipe. Tente novamente.', 'error');
      }
    }
  };

  const handleLeave = async () => {
    try {
      await TeamMemberService.deleteTeamMember(teamId); 
      showSnackbar('Você saiu da equipe com sucesso!', 'success');
      onJoinOrLeave();
    } catch (error) {
      console.error('Erro ao sair da equipe:', error);
      showSnackbar('Erro ao sair da equipe. Tente novamente.', 'error');
    }
  };

  const openConfirmationModal = (message: string, action: () => void) => {
    setConfirmationMessage(message);
    setConfirmAction(() => action);
    setIsConfirmationModalOpen(true);
  };

  return (
    <div className="team-member-modal">
      <div className="modal-content">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className={`team-status ${status === 'Privada' ? 'closed' : 'opened'}`}>
              {status} ({memberCount})
            </div>
            <h2>{teamName}</h2>
            
            {members.length >= minParticipant && (
              <p className="min-participant-message">Já atingiu o n° mínimo de integrantes. Já é possível participar da gincana!</p>
            )}

            <ul className="members-list">
              {members.length > 0 ? (
                members.map((member, index) => (
                  <li key={index} className="member-item">
                    {member}
                  </li>
                ))
              ) : (
                <p>Nenhum membro encontrado.</p>
              )}
            </ul>

            {status === 'Privada' && !isUserMember && (
              <div className="password-input">
                <input
                  type="password"
                  placeholder="Senha da equipe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
            
            <div className="members-actions">
              <button className="cancelbutton" onClick={onCancel}>
                <FaTimes style={{ marginRight: '8px' }} /> Cancelar
              </button>
              {isUserMember ? (
                <button className="leavebutton" onClick={() => openConfirmationModal('Tem certeza de que deseja sair da equipe?', handleLeave)}>
                  <FaSignOutAlt style={{ marginRight: '8px' }} /> Sair
                </button>
              ) : (
                <button className="joinbutton" onClick={() => openConfirmationModal('Tem certeza de que deseja entrar na equipe?', handleJoin)}>
                  <FaSignInAlt style={{ marginRight: '8px' }} /> Entrar
                </button>
              )}
            </div>
          </>
        )}
      </div>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onCancel={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmAction}
        message={confirmationMessage}
      />
    </div>
  );
};

export default TeamMembers;
