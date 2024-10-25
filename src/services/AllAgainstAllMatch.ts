import api from './api';
import { AllAgainstAllMatch, AllAgainstAllMatchPayload, PlacementsPayload } from '../models/AllAgainstAllMatch';

export const AllAgainstAllMatchService = {
  async getAllAgainstAllMatches(competitionId: number, gameId: number): Promise<{ allAgainstAllMatches: AllAgainstAllMatch[] }> {
    try {
      const response = await api.get<{ allAgainstAllMatches: AllAgainstAllMatch[] }>('/matches/all', {
        params: { competition_id: competitionId, game_id: gameId }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar partidas:', error);
      throw error;
    }
  },

  async createAllAgainstAllMatch(payload: AllAgainstAllMatchPayload): Promise<AllAgainstAllMatch> {
    try {
      const response = await api.post<AllAgainstAllMatch>('/matches/all', payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar partidas:', error);
      throw error;
    }
  },

  async updatePlacementsAllAgainstAllMatch(
    matchId: number, 
    competitionId: number, 
    gameId: number, 
    placements: PlacementsPayload[]
  ): Promise<AllAgainstAllMatch> {
    try {
      const response = await api.patch<AllAgainstAllMatch>(`/matches/all/${matchId}`, {
        competition_id: competitionId,
        game_id: gameId,
        placements
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar colocações da partidas:', error);
      throw error;
    }
  },

  async deleteAllAgainstAllMatch(competitionId: number, gameId: number): Promise<void> {
    try {
      await api.delete(`/matches/all/${competitionId}/${gameId}`);
    } catch (error) {
      console.error('Erro ao deletar partidas:', error);
      throw error;
    }
  },
};
