import api from './api';
import { Ranking } from '../models/Score';

export const ScoreService = {
  async getScoresByCompetitionId(competitionId: number): Promise<{ ranking: Ranking[] }> {
    try {
      const response = await api.get<{ ranking: Ranking[] }>(`/scores/${competitionId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar pontuações:', error);
      throw error;
    }
  },

  async updateScore(competitionId: number, gameId: number): Promise<Ranking> {
    try {
      const response = await api.patch(`/scores/${competitionId}/${gameId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar pontuação:', error);
      throw error;
    }
  },
};
