import api from './api';
import { Game, GamePayload } from '../models/Game';

export const GameService = {
  async getGames(filter: string = ''): Promise<{ games: Game[] }> {
    try {
      const response = await api.get<{ games: Game[] }>('/games', {
        params: { filter },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar provas:', error);
      throw error;
    }
  },

  async getGameById(gameId: number): Promise<{ game: Game }> {
    try {
      const response = await api.get<{ game: Game }>(`/games/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar prova:', error);
      throw error;
    }
  },

  async getGamesInCompetition(gameId: number): Promise<{ exists: Boolean }> {
    try {
      const response = await api.get<{ exists: Boolean }>(`/games-in-competition/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar provas em gincanas ativas:', error);
      throw error;
    }
  },

  createGame: async (game: GamePayload): Promise<Game> => {
    try {
      const response = await api.post('/games', game);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar prova:', error);
      throw error;
    }
  },

  updateGame: async (gameId: number, game: GamePayload): Promise<Game> => {
    try {
      const response = await api.put(`/games/${gameId}`, game);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar prova:', error);
      throw error;
    }
  },

  deleteGame: async (gameId: number): Promise<void> => {
    try {
      await api.delete(`/games/${gameId}`);
    } catch (error) {
      console.error('Erro ao deletar prova:', error);
      throw error;
    }
  },
};
