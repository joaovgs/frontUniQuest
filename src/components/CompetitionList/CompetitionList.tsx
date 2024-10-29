import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CompetitionList.css';
import CompetitionCreate from '../CompetitionCreate/CompetitionCreate';
import { useSnackbar } from '../../context/SnackbarContext';
import { Competition, CompetitionPayload } from '../../models/Competition';
import { CompetitionService } from '../../services/Competition';
import { TeamService } from '../../services/Team';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

const CompetitionList: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const [loadingCompetitions, setLoadingCompetitions] = useState(true);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('Tem certeza de que deseja excluir esta gincana?');
  const { showSnackbar } = useSnackbar();

  const actionsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCompetitions = useCallback(async (filter: string = '') => {
    if (isCreateModalOpen) {
      return;
    }
    setLoadingCompetitions(true);
    try {
      const response = await CompetitionService.getCompetitions(filter);

      if (response && Array.isArray(response.competitions)) {
        setCompetitions(response.competitions);
      } else {
        setCompetitions([]);
        console.error('Erro: Resposta de gincanas não é um array válido.');
      }
    } catch (error) {
      console.error('Erro ao buscar gincanas:', error);
      setCompetitions([]);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.log('Erro de autenticação. Redirecionando para login...');
        } else if (error.response?.status === 500) {
          showSnackbar('Erro interno do servidor. Tente novamente mais tarde.', 'error');
        }
      }
    } finally {
      setLoadingCompetitions(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchCompetitions();
  }, [fetchCompetitions]);

  const handleSaveCompetition = async (competitionPayload: CompetitionPayload) => {
    try {
      if (selectedCompetition) {
        await CompetitionService.updateCompetition(selectedCompetition.id, competitionPayload);
        showSnackbar('Gincana atualizada com sucesso!', 'success');
      } else {
        await CompetitionService.createCompetition(competitionPayload);
        showSnackbar('Gincana criada com sucesso!', 'success');
      }
      setSearchTerm('');
      await fetchCompetitions('');
      setIsCreateModalOpen(false);
      setSelectedCompetition(null);
    } catch (error) {
      showSnackbar('Erro ao salvar gincana. Tente novamente.', 'error');
      console.error('Erro ao salvar gincana:', error);
    }
  };

  const handleDeleteCompetition = async () => {
    if (selectedCompetition) {
      try {
        const { teams } = await TeamService.getTeams(selectedCompetition.id);
        if (teams.length > 0) {
          setConfirmationMessage('Já existem equipes para esta gincana. Deseja continuar com a exclusão desta gincana?');
        } else {
          setConfirmationMessage('Tem certeza de que deseja excluir esta gincana?');
        }
        setIsConfirmationModalOpen(true);
      } catch (error) {
        showSnackbar('Erro ao verificar equipes. Tente novamente.', 'error');
        console.error('Erro ao verificar equipes:', error);
      }
    }
  };

  const confirmDeleteCompetition = async () => {
    if (selectedCompetition) {
      try {
        await CompetitionService.deleteCompetition(selectedCompetition.id);
        setCompetitions((prevCompetitions) =>
          prevCompetitions.filter((competition) => competition.id !== selectedCompetition.id)
        );
        setSelectedCompetition(null);
        showSnackbar('Gincana excluída com sucesso!', 'success');
      } catch (error) {
        showSnackbar('Erro ao deletar gincana. Tente novamente.', 'error');
        console.error('Erro ao deletar gincana:', error);
      }
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      fetchCompetitions(event.target.value);
    }, 1000);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      fetchCompetitions(searchTerm);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (isCreateModalOpen || isConfirmationModalOpen) {
        if (modalRef.current && !modalRef.current.contains(target)) {
          return;
        }
      } else {
        if (
          !target.closest('.competition-item') &&
          actionsRef.current &&
          !actionsRef.current.contains(target)
        ) {
          setSelectedCompetition(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCreateModalOpen, isConfirmationModalOpen]);

  return (
    <div className="competition-list-container">
      <div className="competition-list-header">
        <h1>Gincanas</h1>
        <div className="subheader">
          <p>Esta tela permite gerenciar as gincanas do sistema. Utilize o campo de busca para encontrar gincanas específicas ou crie, edite e exclua gincanas conforme necessário.</p>
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

      {loadingCompetitions ? (
        <div className="spinner-container">
          <Spinner />
        </div>
      ) : (
        <div className="competition-list">
          {competitions.length === 0 ? (
            <p>Nenhuma gincana encontrada.</p>
          ) : (
            competitions.map((competition, index) => (
              <div
                key={index}
                className={`competition-item ${selectedCompetition === competition ? 'selected' : ''}`}
                onClick={() => setSelectedCompetition(competition)}
              >
                {competition.title}
              </div>
            ))
          )}
        </div>
      )}

      <div className="actions" ref={actionsRef}>
        <button
          className="create-button"
          onClick={() => {
            setSelectedCompetition(null);
            setIsCreateModalOpen(true);
          }}
        >
          Criar
        </button>
        <button
          className="edit-button"
          onClick={() => setIsCreateModalOpen(true)}
          disabled={!selectedCompetition}
        >
          Editar
        </button>
        <button
          className="delete-button"
          onClick={handleDeleteCompetition}
          disabled={!selectedCompetition}
        >
          Excluir
        </button>
      </div>

      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div ref={modalRef}>
            <CompetitionCreate
              onClose={() => setIsCreateModalOpen(false)}
              onSave={handleSaveCompetition}
              initialCompetition={selectedCompetition || undefined}
            />
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        message={confirmationMessage}
        onConfirm={() => {
          confirmDeleteCompetition();
          setIsConfirmationModalOpen(false);
        }}
        onCancel={() => setIsConfirmationModalOpen(false)}
      />
    </div>
  );
};

export default CompetitionList;
