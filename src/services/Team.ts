import api from './api';
import { Team, TeamPayload } from '../models/Team';

export const TeamService = {
  async getTeams(competitionId: number, filter: string = ''): Promise<{ teams: Team[] }> {
    try {
      const response = await api.get<{ teams: Team[] }>(`/${competitionId}/teams`, {
        params: { filter },
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar equipes:', error);
      throw error;
    }
  },

  createTeam: async (team: TeamPayload): Promise<Team> => {
    try {
      const response = await api.post('/teams', team);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar equipe:', error);
      throw error;
    }
  },

  updateTeam: async (teamId: number, team: TeamPayload): Promise<Team> => {
    try {
      const response = await api.put(`/teams/${teamId}`, team);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar equipe:', error);
      throw error;
    }
  },

  deleteTeam: async (teamId: number): Promise<void> => {
    try {
      await api.delete(`/teams/${teamId}`);
    } catch (error) {
      console.error('Erro ao deletar equipe:', error);
      throw error;
    }
  },
};

