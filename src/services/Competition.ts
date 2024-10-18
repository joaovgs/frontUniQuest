import api from './api';
import { Competition, CompetitionPayload } from '../models/Competition';

export const CompetitionService = {
  async getCompetitions(filter: string = ''): Promise<{ competitions: Competition[] }> {
    try {
      const response = await api.get<{ competitions: Competition[] }>('/competitions', {
        params: { filter }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar competições:', error);
      throw error;
    }
  },

  createCompetition: async (competition: CompetitionPayload): Promise<Competition> => {
    try {
      const response = await api.post('/competitions', competition);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar competição:', error);
      throw error;
    }
  },

  updateCompetition: async (competitionId: number, competition: CompetitionPayload): Promise<Competition> => {
    try {
      const response = await api.put(`/competitions/${competitionId}`, competition);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar competição:', error);
      throw error;
    }
  },

  deleteCompetition: async (competitionId: number): Promise<void> => {
    try {
      await api.delete(`/competitions/${competitionId}`);
    } catch (error) {
      console.error('Erro ao deletar competição:', error);
      throw error;
    }
  },
};
