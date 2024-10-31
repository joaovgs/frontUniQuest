import api from './api';
import { TeamMember, TeamMemberPayload } from '../models/TeamMember';

export const TeamMemberService = {
  async getTeamMembers(teamId: number): Promise<{ teamMembers: TeamMember[] }> {
    try {
      const response = await api.get<{ teamMembers: TeamMember[] }>(`/teamMembers/${teamId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar membros da equipe:', error);
      throw error;
    }
  },

  async getUserInCompetition(competitionId: number): Promise<{ team_id: number }> {
    try {
      const response = await api.get<{ team_id: number }>(`/teamMembers/me/${competitionId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar equipe do usuário	:', error);
      throw error;
    }
  },

  createTeamMember: async (teamMember: TeamMemberPayload): Promise<TeamMember> => {
    try {
      const response = await api.post('/teamMembers', teamMember);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar membro da equipe:', error);
      throw error;
    }
  },

  deleteTeamMember: async (teamId: number): Promise<void> => {
    try {
      await api.delete(`/teamMembers/${teamId}`);
    } catch (error) {
      console.error('Erro ao deletar membro da equipe:', error);
      throw error;
    }
  },
};
