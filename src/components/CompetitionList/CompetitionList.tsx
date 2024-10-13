import React, { useState } from 'react';
import './CompetitionList.css';
import CompetitionCreate from '../CompetitionCreate/CompetitionCreate'; // Importar o modal de criação de gincanas

interface Competition {
  title: string;
  startDate: string;
  endDate: string;
}

const CompetitionList: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([
  ]); // Lista de gincanas

  const [searchTerm, setSearchTerm] = useState(''); // Estado para controle de pesquisa
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Estado para exibir o modal de criação
  const [selectedCompetitionIndex, setSelectedCompetitionIndex] = useState<number | null>(null); // Índice da gincana selecionada para edição

  // Função para abrir o modal de criação
  const handleOpenCreateModal = () => {
    setSelectedCompetitionIndex(null); // Limpa a seleção
    setIsCreateModalOpen(true); // Abre o modal
  };

  // Função para abrir o modal de edição
  const handleOpenEditModal = () => {
    if (selectedCompetitionIndex !== null) {
      setIsCreateModalOpen(true); // Abre o modal para edição
    }
  };

  // Função para fechar o modal
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false); // Fecha o modal
  };

  // Função para salvar uma nova gincana ou editar uma existente
  const handleSaveCompetition = (newCompetition: Competition) => {
    if (selectedCompetitionIndex !== null) {
      // Atualizar a gincana existente
      const updatedCompetitions = [...competitions];
      updatedCompetitions[selectedCompetitionIndex] = newCompetition;
      setCompetitions(updatedCompetitions);
    } else {
      // Adicionar nova gincana
      setCompetitions([...competitions, newCompetition]);
    }
    handleCloseCreateModal(); // Fecha o modal após salvar
  };

  // Função para selecionar uma gincana da lista
  const handleCompetitionClick = (index: number) => {
    setSelectedCompetitionIndex(index); // Seleciona a gincana
  };

  // Filtrar gincanas com base no termo de pesquisa
  const filteredCompetitions = competitions.filter((competition) =>
    competition.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="competition-list-container">
      <div className="competition-list-header">
        <h1>Gincanas</h1>
        <input
          type="text"
          placeholder="Pesquisar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Lista de gincanas */}
      <div className="competition-list">
        {filteredCompetitions.length === 0 ? (
          <p>Nenhuma gincana encontrada.</p>
        ) : (
          filteredCompetitions.map((competition, index) => (
            <div
              key={index}
              className={`competition-item ${selectedCompetitionIndex === index ? 'selected' : ''}`}
              onClick={() => handleCompetitionClick(index)}
            >
              {competition.title}
            </div>
          ))
        )}
      </div>

      {/* Rodapé com botões */}
      <div className="actions">
        <button className="create-button" onClick={handleOpenCreateModal}>
          Criar
        </button>
        <button
          className="edit-button"
          onClick={handleOpenEditModal}
          disabled={selectedCompetitionIndex === null}
        >
          Editar
        </button>
        <button
          className="delete-button"
          onClick={() => setCompetitions(competitions.filter((_, index) => index !== selectedCompetitionIndex))}
          disabled={selectedCompetitionIndex === null}
        >
          Excluir
        </button>
      </div>

      {/* Modal de Criação/Edição de Gincanas */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <CompetitionCreate
            onClose={handleCloseCreateModal}
            onSave={handleSaveCompetition}
            initialCompetition={selectedCompetitionIndex !== null ? competitions[selectedCompetitionIndex] : null}
          />
        </div>
      )}
    </div>
  );
};

export default CompetitionList;
