import React, { useState, useEffect } from 'react';
import './TeamMembers.css';
import { TeamMemberService } from '../../services/TeamMember'; 
import { useSnackbar } from '../../context/SnackbarContext';
import { TeamMemberPayload } from '../../models/TeamMember';

interface TeamMembersProps {
  teamId: number; 
  teamName: string;
  status: 'Pública' | 'Privada';
  memberCount: string;
  onJoin: () => void;
  onCancel: () => void;
  competitionId: number;
  userTeamId: number | null;
}

const TeamMembers: React.FC<TeamMembersProps> = ({ teamId, teamName, status, memberCount, onJoin, onCancel, competitionId, userTeamId }) => {
  const [members, setMembers] = useState<string[]>([]); 
  const [password, setPassword] = useState<string>('');
  const [isUserMember, setIsUserMember] = useState<boolean>(false);
  const { showSnackbar } = useSnackbar(); 
  
  const fetchTeamMembers = async () => {
    try {
      const response = await TeamMemberService.getTeamMembers(teamId); 
      const teamMembers = response.teamMembers.map(member => member.user_name); 
      setMembers(teamMembers); 
      
      const userResponse = await TeamMemberService.getUserInCompetition(competitionId); 
      setIsUserMember(userResponse.team_id === teamId);
      
    } catch (error) {
      console.error('Erro ao buscar membros da equipe:', error);
      showSnackbar('Erro ao carregar os membros da equipe. Tente novamente.', 'error');
    }
  };

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
      onJoin();
      onCancel(); 
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
      onCancel();
    } catch (error) {
      console.error('Erro ao sair da equipe:', error);
      showSnackbar('Erro ao sair da equipe. Tente novamente.', 'error');
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [teamId]); 

  return (
    <div className="team-member-modal">
      <div className="modal-content">
        <div className={`team-status ${status === 'Privada' ? 'closed' : 'opened'}`}>
          {status} ({memberCount})
        </div>
        <h2>{teamName}</h2>
        
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
          <button className="cancelbutton" onClick={onCancel}>Cancelar</button>
          {isUserMember ? (
            <button className="leavebutton" onClick={handleLeave}>Sair</button>
          ) : (
            <button className="joinbutton" onClick={handleJoin}>Entrar</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
