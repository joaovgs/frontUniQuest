import React, { useState } from 'react';
import './UserList.css';
import { useNavigate } from 'react-router-dom';

function UserList() {
  const [users, setUsers] = useState([]); // Lista de usuários
  const [newUser, setNewUser] = useState({
    nome: '',
    usuario: '',
    senha: '',
  }); // Estado para armazenar os dados do novo usuário
  const [searchTerm, setSearchTerm] = useState(''); // Estado da barra de pesquisa
  const [selectedUserIndex, setSelectedUserIndex] = useState(null); // Índice do usuário selecionado
  const [isCreating, setIsCreating] = useState(false); // Controle de criação
  const [isEditing, setIsEditing] = useState(false); // Controle de edição
  const navigate = useNavigate(); // Hook para navegação

  // Criar novo usuário
  const handleCreateUser = () => {
    if (newUser.nome.trim() !== '' && newUser.usuario.trim() !== '' && newUser.senha.trim() !== '') {
      setUsers([...users, newUser]); // Adiciona o novo usuário à lista
      setNewUser({ nome: '', usuario: '', senha: '' }); // Limpa o formulário
      setIsCreating(false); // Fecha o modal de criação
    }
  };

  // Abrir modal de criação
  const handleOpenCreateModal = () => {
    setNewUser({ nome: '', usuario: '', senha: '' });
    setIsCreating(true);
    setIsEditing(false);
  };

  // Abrir modal de edição
  const handleOpenEditModal = () => {
    if (selectedUserIndex !== null) {
      const userToEdit = users[selectedUserIndex];
      setNewUser(userToEdit); // Preenche o formulário com os dados do usuário selecionado
      setIsCreating(true); // Usa o mesmo modal de criação para edição
      setIsEditing(true); // Define que estamos editando
    }
  };

  // Salvar usuário editado
  const handleSaveEditUser = () => {
    if (newUser.nome.trim() !== '' && newUser.usuario.trim() !== '' && newUser.senha.trim() !== '') {
      const updatedUsers = [...users];
      updatedUsers[selectedUserIndex] = newUser; // Atualiza o usuário na lista
      setUsers(updatedUsers);
      setNewUser({ nome: '', usuario: '', senha: '' });
      setIsCreating(false);
      setIsEditing(false);
    }
  };

  // Excluir usuário com confirmação
  const handleDeleteUser = () => {
    if (selectedUserIndex !== null) {
      const confirmed = window.confirm("Tem certeza que deseja excluir o usuário?");
      if (confirmed) {
        const updatedUsers = users.filter((_, index) => index !== selectedUserIndex); // Remove o usuário selecionado
        setUsers(updatedUsers);
        setSelectedUserIndex(null); // Limpa a seleção
      }
    }
  };

  // Cancelar a ação
  const handleCancel = () => {
    setNewUser({ nome: '', usuario: '', senha: '' });
    setIsCreating(false); // Fecha o modal sem salvar
    setIsEditing(false); // Define que não estamos mais editando
  };

  // Detectar alterações no formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  // Detectar alterações na barra de pesquisa
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Atualiza o termo de pesquisa
  };

  // Filtrar usuários com base no termo de pesquisa
  const filteredUsers = users.filter((user) =>
    user.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Selecionar um usuário na lista
  const handleUserClick = (index) => {
    setSelectedUserIndex(index); // Define o usuário selecionado pelo índice
  };

  // Redireciona para a home ao clicar na logo
  const handleLogoClick = () => {
    navigate('/home');
  };

  return (
    <div className="userlist-container">
      <div className="userlist-header">
        <img
          src="/images/logo.png" // Usando o caminho relativo ao "public"
          alt="Logo"
          className="logo-icon"
          onClick={handleLogoClick}
          style={{ cursor: 'pointer' }} // Cursor de ponteiro para indicar clique
        />
        <h2>Usuários</h2>
      </div>

      <input
        type="text"
        placeholder="Pesquisar"
        className="search-input"
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <div className="user-list">
        {filteredUsers.length === 0 ? (
          <p>Nenhum organizador encontrado.</p>
        ) : (
          filteredUsers.map((user, index) => (
            <div
              key={index}
              className={`user-item ${selectedUserIndex === index ? 'selected' : ''}`}
              onClick={() => handleUserClick(index)}
            >
              {user.nome}
            </div>
          ))
        )}
      </div>

      <div className="actions">
        <button className="create-button" onClick={handleOpenCreateModal}>Criar</button>
        <button
          className="edit-button"
          onClick={handleOpenEditModal}
          disabled={selectedUserIndex === null}
        >
          Editar
        </button>
        <button
          className="delete-button"
          onClick={handleDeleteUser}
          disabled={selectedUserIndex === null}
        >
          Excluir
        </button>
      </div>

      {/* Modal de criação e edição */}
      {isCreating && (
        <div className="create-user-modal">
          <h3>{isEditing ? 'Editar Usuário' : 'Criar Novo Usuário'}</h3>
          <input
            type="text"
            name="nome"
            value={newUser.nome}
            onChange={handleInputChange}
            placeholder="Nome"
          />
          <input
            type="text"
            name="usuario"
            value={newUser.usuario}
            onChange={handleInputChange}
            placeholder="Usuário"
          />
          <input
            type="password"
            name="senha"
            value={newUser.senha}
            onChange={handleInputChange}
            placeholder="Senha"
          />
          <div className="modal-actions">
            <button className="cancel-button" onClick={handleCancel}>Cancelar</button>
            <button
              className="save-button"
              onClick={isEditing ? handleSaveEditUser : handleCreateUser}
            >
              {isEditing ? 'Salvar Alterações' : 'Salvar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserList;
