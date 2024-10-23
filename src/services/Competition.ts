import api from './api';
import { Competition, CompetitionPayload, CompetitionImages, Regulation, CompetitionWithoutRegulation } from '../models/Competition';

export const CompetitionService = {
  async getById(competitionId: number): Promise<{ competition: CompetitionWithoutRegulation }> {
    try {
      const response = await api.get<{ competition: CompetitionWithoutRegulation }>(`/competitions/${competitionId}`);
      return response.data; 
    } catch (error) {
      console.error('Erro ao buscar gincana:', error);
      throw error;
    }
  },
  
  async getImages(): Promise<{ competitions: CompetitionImages[] }> {
    try {
      const response = await api.get<{ competitions: CompetitionImages[] }>('/competitions/images');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar imagens das gincanas:', error);
      throw error;
    }
  },

  async getRegulation(competitionId: number): Promise<{ regulation: Regulation }> {
    try {
      const response = await api.get<{ regulation: Regulation }>(`/competitions/regulation/${competitionId}`);
      return response.data; 
    } catch (error) {
      console.error('Erro ao buscar regulamento:', error);
      throw error;
    }
  },

  async getCompetitions(filter: string = ''): Promise<{ competitions: Competition[] }> {
    try {
      const response = await api.get<{ competitions: Competition[] }>('/competitions', {
        params: { filter }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar gincanas:', error);
      throw error;
    }
  },

  createCompetition: async (competition: CompetitionPayload): Promise<Competition> => {
    try {
      const response = await api.post('/competitions', competition);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar gincana:', error);
      throw error;
    }
  },

  updateCompetition: async (competitionId: number, competition: CompetitionPayload): Promise<Competition> => {
    try {
      const response = await api.put(`/competitions/${competitionId}`, competition);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar gincana:', error);
      throw error;
    }
  },

  deleteCompetition: async (competitionId: number): Promise<void> => {
    try {
      await api.delete(`/competitions/${competitionId}`);
    } catch (error) {
      console.error('Erro ao deletar gincana:', error);
      throw error;
    }
  },
};
