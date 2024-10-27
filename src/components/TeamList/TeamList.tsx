import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import './TeamList.css';
import { TeamService } from '../../services/Team';
import { CompetitionService } from '../../services/Competition';
import Spinner from '../Spinner/Spinner';
import { Team } from '../../models/Team';
import { Competition } from '../../models/Competition';
import ApprovalModal from '../TeamApproval/TeamApproval'; 

const TeamList: React.FC = () => {
  const { competitionId } = useParams<{ competitionId: string }>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'Todos' | 'Pendente' | 'Aprovada' | 'Rejeitada'>('Todos');
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<number>(Number(competitionId));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

  const mapStatusToText = (status: number | null | undefined): string => {
    switch (status) {
      case 1:
        return 'Aprovada';
      case -1:
        return 'Rejeitada';
      case 0:
      default:
        return 'Pendente';
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value as 'Todos' | 'Pendente' | 'Aprovada' | 'Rejeitada');
  };

  const handleCompetitionIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCompetitionId(Number(event.target.value));
  };

  const filteredTeams = teams.filter((team) => {
    if (filterStatus === 'Todos') return true;
    return mapStatusToText(team.status) === filterStatus;
  });

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const { competitions } = await CompetitionService.getCompetitions();
        setCompetitions(competitions);
        if (competitions.length > 0) {
          setSelectedCompetitionId(competitions[0].id);
        }
      } catch (error) {
        console.error('Erro ao buscar gincanas:', error);
      }
    };

    fetchCompetitions();
  }, []);

  const fetchTeamsForApproval = useCallback(async () => {
    if (!selectedCompetitionId) {
      setLoadingTeams(false);
      return;
    }
    setLoadingTeams(true);
    try {
      const { teams } = await TeamService.getTeamsForApproval(selectedCompetitionId);
      console.log('Fetched teams:', teams); 
      setTeams(teams);
    } catch (error) {
      console.error('Erro ao buscar equipes para aprovação:', error);
    } finally {
      setLoadingTeams(false);
    }
  }, [selectedCompetitionId]);

  useEffect(() => {
    fetchTeamsForApproval();
  }, [fetchTeamsForApproval]);

  const openModal = (team: Team) => {
    setSelectedTeam(team);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTeam(null);
    fetchTeamsForApproval();
  };

  return (
    <div className="team-overview-container">
      <h1>Inscrições das Equipes</h1>

      <div className="filter-container">
        <label htmlFor="competitionIdSelect">Selecionar Gincana:</label>
        <select
          id="competitionIdSelect"
          value={selectedCompetitionId}
          onChange={handleCompetitionIdChange}
          className="competition-id-select"
        >
          {competitions.map((competition) => (
            <option key={competition.id} value={competition.id}>
              {competition.title}
            </option>
          ))}
        </select>

        <label htmlFor="statusFilter">Filtrar por status:</label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={handleFilterChange}
          className="status-filter"
        >
          <option value="Todos">Todos</option>
          <option value="Pendente">Pendente</option>
          <option value="Aprovada">Aprovada</option>
          <option value="Rejeitada">Rejeitada</option>
        </select>
      </div>

      {loadingTeams ? (
        <div className="spinner-container">
          <Spinner />
        </div>
      ) : (
        <div className="teams-grid">
          {filteredTeams.length === 0 ? (
            <p>Nenhuma equipe encontrada.</p>
          ) : (
            filteredTeams.map((team, index) => (
              <div key={index} className="team-card" onClick={() => openModal(team)}>
                <div className={`team-status ${mapStatusToText(team.status).toLowerCase()}`}>
                  {mapStatusToText(team.status)}
                </div>
                <h3>{team.name}</h3>
                <p>{team.members_count}/{team.max_participant}</p>
              </div>
            ))
          )}
        </div>
      )}

      {isModalOpen && selectedTeam && (
        <ApprovalModal
          teamId={selectedTeam.id}
          teamName={selectedTeam.name}
          status={mapStatusToText(selectedTeam.status)}
          memberCount={`${selectedTeam.members_count}/${selectedTeam.max_participant}`}
          competitionId={selectedCompetitionId}
          userTeamId={null}
          onApprove={() => {
            closeModal();
          }}
          onReject={(message) => {
            closeModal();
          }}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default TeamList;
