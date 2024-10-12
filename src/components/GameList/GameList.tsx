import React, { useState } from 'react';
import './GameList.css';
import GameCreate from '../GameCreate/GameCreate';

interface Game {
  gameName: string;
  minParticipants: string;
  maxParticipants: string;
  firstPlacePoints: string;
  secondPlacePoints: string;
  thirdPlacePoints: string;
  generalPoints: string;
  category: string;
}

const GameList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]); // Lista de games
  const [searchTerm, setSearchTerm] = useState(''); // Estado para controle de pesquisa
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Estado para exibir o modal
  const [selectedGame, setSelectedGame] = useState<Game | null>(null); // Estado para armazenar o game selecionado

  // Função para abrir o modal de criação ou edição
  const handleOpenCreateModal = (game?: Game) => {
    if (game) {
      setSelectedGame(game); // Se um game for passado, configurar para edição
    } else {
      setSelectedGame(null); // Limpar o game selecionado para garantir criação de novo game
    }
    setIsCreateModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedGame(null); // Limpa o game selecionado ao fechar o modal
  };

  // Função para salvar um novo game ou atualizar um existente
  const handleSaveGame = (game: Game) => {
    if (selectedGame) {
      // Atualizar game existente
      const updatedGames = games.map((g) =>
        g.gameName === selectedGame.gameName ? game : g
      );
      setGames(updatedGames);
    } else {
      // Adicionar novo game à lista
      setGames([...games, game]);
    }
    handleCloseCreateModal(); // Fechar modal
  };

  // Função para deletar um game
  const handleDeleteGame = () => {
    if (selectedGame) {
      const updatedGames = games.filter((g) => g !== selectedGame);
      setGames(updatedGames);
      setSelectedGame(null);
    }
  };

  // Filtrar games com base no termo de pesquisa
  const filteredGames = games.filter((game) =>
    game.gameName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="game-list-container">
      <div className="game-list-header">
        <h1>Provas</h1>
        <input
          type="text"
          placeholder="Pesquisar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Lista de games */}
      <div className="game-list">
        {filteredGames.length === 0 ? (
          <p>Nenhuma prova encontrada.</p>
        ) : (
          filteredGames.map((game, index) => (
            <div
              key={index}
              className={`game-item ${selectedGame === game ? 'selected' : ''}`}
              onClick={() => setSelectedGame(game)}
            >
              {game.gameName}
            </div>
          ))
        )}
      </div>

      {/* Rodapé com botões */}
      <div className="actions">
        <button className="create-button" onClick={() => handleOpenCreateModal()}>
          Criar
        </button>
        <button
          className="edit-button"
          onClick={() => handleOpenCreateModal(selectedGame || undefined)}
          disabled={!selectedGame}
        >
          Editar
        </button>
        <button className="delete-button" onClick={handleDeleteGame} disabled={!selectedGame}>
          Excluir
        </button>
      </div>

      {/* Modal de Criação de Games */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <GameCreate
            onClose={handleCloseCreateModal}
            onSave={handleSaveGame}
            initialGame={selectedGame || undefined} // Passar o game selecionado para edição
          />
        </div>
      )}
    </div>
  );
};

export default GameList;
