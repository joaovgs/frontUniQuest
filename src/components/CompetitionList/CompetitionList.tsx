import React, { useState, useEffect, useRef } from 'react';
import './CompetitionList.css';
import CompetitionCreate from '../CompetitionCreate/CompetitionCreate';
import { useSnackbar } from '../../context/SnackbarContext';
import { Competition, CompetitionPayload } from '../../models/Competition';
import { CompetitionService } from '../../services/Competition';
import axios from 'axios';

const CompetitionList: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null);
  const { showSnackbar } = useSnackbar();

  const actionsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const fetchCompetitions = async (filter: string = '') => {
    try {
      const response = await CompetitionService.getCompetitions(filter);

      if (response && Array.isArray(response.competitions)) {
        setCompetitions(response.competitions);
      } else {
        setCompetitions([]);
        console.error('Erro: Resposta de competições não é um array válido.');
      }
    } catch (error) {
      console.error('Erro ao buscar competições:', error);
      setCompetitions([]);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.log('Erro de autenticação. Redirecionando para login...');
        } else if (error.response?.status === 500) {
          showSnackbar('Erro interno do servidor. Tente novamente mais tarde.', 'error');
        }
      }
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

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

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      fetchCompetitions(searchTerm);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (isCreateModalOpen) {
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
  }, [isCreateModalOpen]);

  return (
    <div className="competition-list-container">
      <div className="competition-list-header">
        <h1>Gincanas</h1>
        <input
          type="text"
          placeholder="Pesquisar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="search-input"
        />
      </div>

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
    </div>
  );
};

export default CompetitionList;
