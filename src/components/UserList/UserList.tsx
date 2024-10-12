import React, { useState, useEffect } from 'react';
import './UserList.css';
import UserCreate from '../UserCreate/UserCreate';
import { useNavigate } from 'react-router-dom';
import { User, UserPayload } from '../../models/User';
import { UserService } from '../../services/UserService';
import axios from 'axios';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Função para buscar os usuários com ou sem filtro
  const fetchUsers = async (filter: string = '') => {
    try {
      // Obtem o objeto que contém o array de usuários
      const response = await UserService.getUsers(filter);

      // Verifica se a resposta contém a chave `users` e se é um array
      if (response && Array.isArray(response.users)) {
        setUsers(response.users); // Atualiza o estado com o array de usuários
      } else {
        setUsers([]); // Define um array vazio caso a resposta não seja um array válido
        console.error('Erro: Resposta de usuários não é um array válido.');
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setUsers([]); // Definir como array vazio em caso de erro

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.log('Erro de autenticação. Redirecionando para login...');
          navigate('/login');
        } else if (error.response?.status === 500) {
          console.log('Erro interno do servidor. Tente novamente mais tarde.');
        }
      }
    }
  };

  useEffect(() => {
    fetchUsers(); // Busca inicial sem filtro
  }, []);

  const handleSaveUser = async (userPayload: UserPayload) => {
    try {
      if (selectedUser) {
        const updatedUser = await UserService.updateUser(selectedUser.id, userPayload);
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === selectedUser.id ? updatedUser : u))
        );
      } else {
        const newUser = await UserService.createUser(userPayload);
        setUsers((prevUsers) => [...prevUsers, newUser]);
      }
      setIsCreateModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await UserService.deleteUser(selectedUser.id);
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== selectedUser.id));
        setSelectedUser(null);
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
      }
    }
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      fetchUsers(searchTerm);
    }
  };

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h1>Usuários</h1>
        <input
          type="text"
          placeholder="Pesquisar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearchKeyDown}
        />
      </div>

      <div className="user-list">
        {users.length === 0 ? (
          <p>Nenhum organizador encontrado.</p>
        ) : (
          users.map((user, index) => (
            <div
              key={index}
              className={`user-item ${selectedUser === user ? 'selected' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              {user.name}
            </div>
          ))
        )}
      </div>

      <div className="actions">
        <button className="create-button" onClick={() => setIsCreateModalOpen(true)}>
          Criar
        </button>
        <button
          className="edit-button"
          onClick={() => setIsCreateModalOpen(true)}
          disabled={!selectedUser}
        >
          Editar
        </button>
        <button className="delete-button" onClick={handleDeleteUser} disabled={!selectedUser}>
          Excluir
        </button>
      </div>

      {isCreateModalOpen && (
        <div className="modal-overlay">
          <UserCreate onClose={() => setIsCreateModalOpen(false)} onSave={handleSaveUser} initialUser={selectedUser || undefined} />
        </div>
      )}
    </div>
  );
};

export default UserList;
