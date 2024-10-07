// UserList.tsx
import React, { useState, ChangeEvent } from 'react';
import './UserList.css';
import UserCreate from '../UserCreate/UserCreate';
import { useNavigate } from 'react-router-dom';

interface User {
  nome: string;
  email: string;
  senha: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // Lista de usuários
  const [searchTerm, setSearchTerm] = useState(''); // Estado para controle de pesquisa
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Estado para exibir o modal
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Estado para armazenar o usuário selecionado
  const navigate = useNavigate(); // Hook para navegação

  // Função para abrir o modal de criação ou edição
  const handleOpenCreateModal = (user?: User) => {
    if (user) {
      setSelectedUser(user); // Se um usuário for passado, abrir o modal no modo de edição
    }
    setIsCreateModalOpen(true);
  };

  // Função para fechar o modal
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedUser(null); // Limpa o usuário selecionado ao fechar o modal
  };

  // Função para salvar um novo usuário ou atualizar um existente
  const handleSaveUser = (user: User) => {
    if (selectedUser) {
      // Atualizar usuário existente
      const updatedUsers = users.map((u) => (u.email === selectedUser.email ? user : u));
      setUsers(updatedUsers);
    } else {
      // Adicionar novo usuário à lista
      setUsers([...users, user]);
    }
    handleCloseCreateModal(); // Fechar modal
  };

  // Função para deletar um usuário
  const handleDeleteUser = () => {
    if (selectedUser) {
      const updatedUsers = users.filter((u) => u !== selectedUser);
      setUsers(updatedUsers);
      setSelectedUser(null);
    }
  };

  // Filtrar usuários com base no termo de pesquisa
  const filteredUsers = users.filter((user) =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h1>Usuários</h1>
        <input
          type="text"
          placeholder="Pesquisar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Lista de usuários */}
      <div className="user-list">
        {filteredUsers.length === 0 ? (
          <p>Nenhum organizador encontrado.</p>
        ) : (
          filteredUsers.map((user, index) => (
            <div
              key={index}
              className={`user-item ${selectedUser === user ? 'selected' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              {user.nome}
            </div>
          ))
        )}
      </div>

      {/* Rodapé com botões */}
      <div className="actions">
        <button className="create-button" onClick={() => handleOpenCreateModal()}>
          Criar
        </button>
        <button
          className="edit-button"
          onClick={() => handleOpenCreateModal(selectedUser || undefined)}
          disabled={!selectedUser}
        >
          Editar
        </button>
        <button className="delete-button" onClick={handleDeleteUser} disabled={!selectedUser}>
          Excluir
        </button>
      </div>

      {/* Modal de Criação de Usuários */}
      {isCreateModalOpen && (
        <div className="modal-overlay">
          <UserCreate onClose={handleCloseCreateModal} onSave={handleSaveUser} initialUser={selectedUser || undefined} />
        </div>
      )}
    </div>
  );
};

export default UserList;
