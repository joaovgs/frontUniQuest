import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './TeamRegistration.css';
import TeamCreate from '../TeamCreate/TeamCreate';
import TeamMembers from '../TeamMembers/TeamMembers'; 
import { useSnackbar } from '../../context/SnackbarContext';
import { Team, TeamPayload } from '../../models/Team';
import { TeamService } from '../../services/Team';
import axios from 'axios';
import Spinner from '../Spinner/Spinner'; 
import { TeamMemberService } from '../../services/TeamMember';
import { FaPlus } from 'react-icons/fa';

const TeamRegistration: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>(); 
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isParticipantsModalOpen, setIsParticipantsModalOpen] = useState(false); 
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [userTeamId, setUserTeamId] = useState<number | null>(null);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const { showSnackbar } = useSnackbar();

  const actionsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);  

  const fetchTeams = useCallback(async (filter: string = '') => {

    if (isCreateModalOpen) {
      return;
    }
    setLoadingTeams(true);
    try {
      const { team_id } = await TeamMemberService.getUserInCompetition(Number(competitionId));
      setUserTeamId(team_id);

      const response = await TeamService.getTeams(Number(competitionId), filter);

      if (response && Array.isArray(response.teams)) {
        const sortedTeams = response.teams.sort((a, b) => {
          if (a.id === team_id) return -1;
          if (b.id === team_id) return 1;
          return 0;
        });
        setTeams(sortedTeams);
      } else {
        setTeams([]);
        console.error('Erro: Resposta de equipes não é um array válido.');
      }
    } catch (error) {
      console.error('Erro ao buscar equipes:', error);
      setTeams([]);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.log('Erro de autenticação. Redirecionando para login...');
        } else if (error.response?.status === 500) {
          showSnackbar('Erro interno do servidor. Tente novamente mais tarde.', 'error');
        }
      }
    } finally {
      setLoadingTeams(false); 
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [competitionId, fetchTeams]);

  const handleSaveTeam = async (teamPayload: TeamPayload) => {
    try {
      await TeamService.createTeam(teamPayload);
      showSnackbar('Equipe criada com sucesso!', 'success');
      setIsCreateModalOpen(false);
      setSearchTerm('');
      setSelectedTeam(null);
      await fetchTeams('');
    } catch (error) {
      showSnackbar('Erro ao salvar equipe. Tente novamente.', 'error');
      console.error('Erro ao salvar equipe:', error);
    }
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      fetchTeams(searchTerm);
    }
  };

  const handleCreateButtonClick = () => {
    if (userTeamId !== null) {
      showSnackbar('Você já está em uma equipe!', 'error');
    } else {
      setIsCreateModalOpen(true);
    }
  };

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    setIsParticipantsModalOpen(true);
  };

  const handleCloseParticipantsModal = () => {
    setIsParticipantsModalOpen(false);
    setSelectedTeam(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      fetchTeams(event.target.value);
    }, 1000);
  };

  const handleJoinOrLeave = async () => {
    console.log('handleJoinOrLeave');
    await fetchTeams();
    handleCloseParticipantsModal();    
  };

  return (
    <div className="team-list-container">
      <div className="team-list-header">
        <h1>Equipes</h1>
        <div className="subheader">          
          <p>Esta tela permite gerenciar as equipes da gincana. Utilize o campo de busca para encontrar equipes específicas e você poderá entrar ou sair, ou então criar a sua própria equipe.</p>
        </div>
        <input
          type="text"
          placeholder="Pesquisar"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          className="search-input"
        />
      </div>

      {loadingTeams ? (
        <div className="spinner-container">
          <Spinner />
        </div>
      ) : (
        <div className="teams-grid">
          {teams.length === 0 ? (
            <p>Nenhuma equipe encontrada.</p>
          ) : (
            teams.map((team, index) => (
              <div
                key={index}
                className={"team-registration-card"}
                onClick={() => handleTeamClick(team)}
              >
                <div className={`team-status ${team.is_private === 1 ? 'private' : 'public'}`}>
                  {team.is_private === 1 ? 'Privada' : 'Pública'}
                </div>
                <h3>{team.name}</h3>
                <p>{team.members_count}/{team.max_participant}</p>
                {userTeamId === team.id && <span className="your-team">Sua equipe</span>}
              </div>
            ))
          )}
        </div>
      )}

      <div className="actions" ref={actionsRef}>
        <button
          className="create-button"
          onClick={handleCreateButtonClick}
          disabled={userTeamId !== null}
          title={userTeamId !== null ? 'Você já está em uma equipe!' : ''}
        >
          <FaPlus style={{ marginRight: '8px' }} />
          Criar
        </button>
      </div>

      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div ref={modalRef}>
            <TeamCreate
              onClose={() => setIsCreateModalOpen(false)}
              onSave={handleSaveTeam}
              competitionId={Number(competitionId)}
            />
          </div>
        </div>
      )}

      {isParticipantsModalOpen && selectedTeam && (
        <div className="modal-overlay">
          <div ref={modalRef}>
            <TeamMembers
              teamId={selectedTeam.id}
              teamName={selectedTeam.name}
              status={selectedTeam.is_private === 1 ? 'Privada' : 'Pública'}
              memberCount={`${selectedTeam.members_count}/${selectedTeam.max_participant}`}
              onJoinOrLeave={handleJoinOrLeave}
              onCancel={handleCloseParticipantsModal}
              competitionId={Number(competitionId)}
              userTeamId={userTeamId}
              minParticipant={selectedTeam.min_participant ?? 0}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamRegistration;
