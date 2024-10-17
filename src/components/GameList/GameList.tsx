import React, { useState, useEffect, useRef } from 'react';
import './GameList.css';
import GameCreate from '../GameCreate/GameCreate';
import { useSnackbar } from '../../context/SnackbarContext';
import { Game, GamePayload } from '../../models/Game';
import { GameService } from '../../services/Game';
import axios from 'axios';

const GameList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const { showSnackbar } = useSnackbar();

  const actionsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const fetchGames = async (filter: string = '') => {
    try {
      const response = await GameService.getGames(filter);

      if (response && Array.isArray(response.games)) {
        setGames(response.games);
      } else {
        setGames([]);
        console.error('Erro: Resposta de games não é um array válido.');
      }
    } catch (error) {
      console.error('Erro ao buscar games:', error);
      setGames([]);

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
    fetchGames();
  }, []);

  const handleSaveGame = async (gamePayload: GamePayload) => {
    try {
      if (selectedGame) {
        await GameService.updateGame(selectedGame.id, gamePayload);
        showSnackbar('Prova atualizada com sucesso!', 'success');
      } else {
        await GameService.createGame(gamePayload);
        showSnackbar('Prova criada com sucesso!', 'success');
      }
      setSearchTerm('');
      await fetchGames('');
      setIsCreateModalOpen(false);
      setSelectedGame(null);
    } catch (error) {
      showSnackbar('Erro ao salvar prova. Tente novamente.', 'error');
      console.error('Erro ao salvar prova:', error);
    }
  };

  const handleDeleteGame = async () => {
    if (selectedGame) {
      try {
        await GameService.deleteGame(selectedGame.id);
        setGames((prevGames) => prevGames.filter((g) => g.id !== selectedGame.id));
        setSelectedGame(null);
        showSnackbar('Prova excluída com sucesso!', 'success');
      } catch (error) {
        showSnackbar('Erro ao deletar prova. Tente novamente.', 'error');
        console.error('Erro ao deletar prova:', error);
      }
    }
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      fetchGames(searchTerm);
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
          !target.closest('.game-item') &&
          actionsRef.current &&
          !actionsRef.current.contains(target)
        ) {
          setSelectedGame(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCreateModalOpen]);

  const handleOpenCreateModal = (game?: Game) => {
    if (game) {
      setSelectedGame(game);
    } else {
      setSelectedGame(null);
    }
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedGame(null);
  };

  return (
    <div className="game-list-container">
      <div className="game-list-header">
        <h1>Provas</h1>
        <input
          type="text"
          placeholder="Pesquisar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="search-input"
        />
      </div>

      <div className="game-list">
        {games.length === 0 ? (
          <p>Nenhuma prova encontrada.</p>
        ) : (
          games.map((game, index) => (
            <div
              key={index}
              className={`game-item ${selectedGame === game ? 'selected' : ''}`}
              onClick={() => setSelectedGame(game)}
            >
              {game.name}
            </div>
          ))
        )}
      </div>

      <div className="actions" ref={actionsRef}>
        <button
          className="create-button"
          onClick={() => handleOpenCreateModal()}
        >
          Criar
        </button>
        <button
          className="edit-button"
          onClick={() => handleOpenCreateModal(selectedGame || undefined)}
          disabled={!selectedGame}
        >
          Editar
        </button>
        <button
          className="delete-button"
          onClick={handleDeleteGame}
          disabled={!selectedGame}
        >
          Excluir
        </button>
      </div>

      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div ref={modalRef}>
            <GameCreate
              onClose={handleCloseCreateModal}
              onSave={handleSaveGame}
              initialGame={selectedGame || undefined}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GameList;
