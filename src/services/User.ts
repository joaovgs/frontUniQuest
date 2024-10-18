import api from './api';
import { User, UserPayload } from '../models/User';

export const UserService = {
  async getUsers(filter: string = ''): Promise<{ users: User[] }> {
    try {
      const response = await api.get<{ users: User[] }>('/users', {
        params: { filter }
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },

  createUser: async (user: UserPayload): Promise<User> => {
    try {
      const response = await api.post('/users', user);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },

  updateUser: async (userId: number, user: UserPayload): Promise<User> => {
    try {
      const response = await api.put(`/users/${userId}`, user);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },

  deleteUser: async (userId: number): Promise<void> => {
    try {
      await api.delete(`/users/${userId}`);
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  },
};
