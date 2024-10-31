import api from './api';
import { DirectConfrontationMatch, DirectConfrontationMatchPayload } from '../models/DirectConfrontationMatch';

export const DirectConfrontationMatchService = {
  async getDirectConfrontationMatches(competitionId: number, gameId: number): Promise<{ directConfrontationMatches: DirectConfrontationMatch[] }> {
    try {
      const response = await api.get<{ directConfrontationMatches: DirectConfrontationMatch[] }>('/matches/direct', {
        params: { competition_id: competitionId, game_id: gameId }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar partidas:', error);
      throw error;
    }
  },

  async createDirectConfrontationMatches(payload: DirectConfrontationMatchPayload): Promise<DirectConfrontationMatch> {
    try {
      const response = await api.post<DirectConfrontationMatch>('/matches/direct', payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar partidas:', error);
      throw error;
    }
  },

  async updateWinnerDirectConfrontationMatch(
    matchId: number,
    competitionId: number,
    gameId: number,
    winnerTeamId: number
  ): Promise<DirectConfrontationMatch> {
    try {
      const response = await api.patch<DirectConfrontationMatch>(`/matches/direct/${matchId}`, {
        competition_id: competitionId,
        game_id: gameId,
        winner_team_id: winnerTeamId
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar vencedor da partida:', error);
      throw error;
    }
  },

  async deleteDirectConfrontationMatches(competitionId: number, gameId: number): Promise<void> {
    try {
      await api.delete(`/matches/direct/${competitionId}/${gameId}`);
    } catch (error) {
      console.error('Erro ao deletar partida:', error);
      throw error;
    }
  },  
};

