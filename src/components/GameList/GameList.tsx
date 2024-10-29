import React, { useState, useEffect, useRef, useCallback } from 'react';
import './GameList.css';
import GameCreate from '../GameCreate/GameCreate';
import { useSnackbar } from '../../context/SnackbarContext';
import { Game, GamePayload } from '../../models/Game';
import { GameService } from '../../services/Game';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';

const GameList: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loadingGames, setLoadingGames] = useState(true);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('Tem certeza de que deseja excluir esta prova?');
  const { showSnackbar } = useSnackbar();

  const actionsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchGames = useCallback(async (filter: string = '') => {
    if (isCreateModalOpen) {
      return;
    }
    setLoadingGames(true);
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
    } finally {
      setLoadingGames(false);
    }
  }, [showSnackbar]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

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
        const { exists } = await GameService.getGamesInCompetition(selectedGame.id);
        if (exists) {
          setConfirmationMessage('Esta prova está em uma gincana ativa. Deseja continuar com a exclusão desta prova?');
        } else {
          setConfirmationMessage('Tem certeza de que deseja excluir esta prova?');
        }
        setIsConfirmationModalOpen(true);
      } catch (error) {
        showSnackbar('Erro ao verificar gincanas. Tente novamente.', 'error');
        console.error('Erro ao verificar gincanas:', error);
      }
    }
  };

  const confirmDeleteGame = async () => {
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      fetchGames(event.target.value);
    }, 1000);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      fetchGames(searchTerm);
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
  }, [isCreateModalOpen, isConfirmationModalOpen]);

  return (
    <div className="game-list-container">
      <div className="game-list-header">
        <h1>Provas</h1>
        <div className="subheader">
          <p>Esta tela permite gerenciar as provas do sistema. Utilize o campo de busca para encontrar provas específicas ou crie, edite e exclua provas conforme necessário.</p>
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

      {loadingGames ? (
        <div className="spinner-container">
          <Spinner />
        </div>
      ) : (
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
      )}

      <div className="actions" ref={actionsRef}>
        <button
          className="create-button"
          onClick={() => {
            setSelectedGame(null);
            setIsCreateModalOpen(true);
          }}
        >
          Criar
        </button>
        <button
          className="edit-button"
          onClick={() => setIsCreateModalOpen(true)}
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
              onClose={() => setIsCreateModalOpen(false)}
              onSave={handleSaveGame}
              initialGame={selectedGame || undefined}
            />
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        message={confirmationMessage}
        onConfirm={() => {
          confirmDeleteGame();
          setIsConfirmationModalOpen(false);
        }}
        onCancel={() => setIsConfirmationModalOpen(false)}
      />
    </div>
  );
};

export default GameList;
