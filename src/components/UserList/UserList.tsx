import React, { useState, useEffect, useRef, useCallback } from 'react';
import './UserList.css';
import UserCreate from '../UserCreate/UserCreate';
import { useSnackbar } from '../../context/SnackbarContext';
import { User, UserPayload } from '../../models/User';
import { UserService } from '../../services/User';
import axios from 'axios';
import Spinner from '../Spinner/Spinner';
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa'; 

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const { showSnackbar } = useSnackbar();

  const actionsRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const fetchUsers = useCallback(async (filter: string = '') => {
    if (isCreateModalOpen) {
      return;
    }
    setLoadingUsers(true);
    try {
      const response = await UserService.getUsers(filter);

      if (response && Array.isArray(response.users)) {
        setUsers(response.users);
      } else {
        setUsers([]);
        console.error('Erro: Resposta de usuários não é um array válido.');
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setUsers([]);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.log('Erro de autenticação. Redirecionando para login...');
        } else if (error.response?.status === 500) {
          showSnackbar('Erro interno do servidor. Tente novamente mais tarde.', 'error');
        }
      }
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSaveUser = async (userPayload: UserPayload) => {
    try {
      if (selectedUser) {
        await UserService.updateUser(selectedUser.id, userPayload);
        showSnackbar('Organizador atualizado com sucesso!', 'success');
      } else {
        await UserService.createUser(userPayload);
        showSnackbar('Organizador criado com sucesso!', 'success');
      }
      setIsCreateModalOpen(false);
      setSelectedUser(null);
      setSearchTerm('');
      await fetchUsers('');
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        showSnackbar('Email já cadastrado no sistema.', 'error');
      } else {
        showSnackbar('Erro ao salvar organizador. Tente novamente.', 'error');
        console.error('Erro ao salvar organizador:', error);
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await UserService.deleteUser(selectedUser.id);
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== selectedUser.id));
        setSelectedUser(null);
        setSearchTerm('');
        await fetchUsers('');
        showSnackbar('Organizador excluído com sucesso!', 'success');
      } catch (error) {
        showSnackbar('Erro ao deletar organizador. Tente novamente.', 'error');
        console.error('Erro ao deletar organizador:', error);
      }
    }
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      fetchUsers(searchTerm);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      fetchUsers(event.target.value);
    }, 1000);
  };

  const handleSearchContainerClick = () => {
    searchInputRef.current?.focus();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (isCreateModalOpen || isConfirmationModalOpen) {
        if (modalRef.current && !modalRef.current.contains(target)) {
          return;
        }
      } else {
        if (
          !target.closest('.user-item') &&
          actionsRef.current &&
          !actionsRef.current.contains(target)
        ) {
          setSelectedUser(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCreateModalOpen, isConfirmationModalOpen]);

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h1>Organizadores</h1>
        <div className="subheader">
          <p>Esta tela permite gerenciar os organizadores do sistema. Utilize o campo de busca para encontrar organizadores específicos ou crie, edite e exclua organizadores conforme necessário.</p>
        </div>
        <div className="search-container" onClick={handleSearchContainerClick}>
          <FaSearch className="search-icon" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Pesquisar"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
            className="search-input"
          />
        </div>
      </div>

      {loadingUsers ? (
        <div className="spinner-container">
          <Spinner />
        </div>
      ) : (
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
                {user.name ? user.name : 'Organizador sem nome'}
              </div>
            ))
          )}
        </div>
      )}

      <div className="actions" ref={actionsRef}>
        <button
          className="create-button"
          onClick={() => {
            setSelectedUser(null);
            setIsCreateModalOpen(true);
          }}
        >
          <FaPlus style={{ marginRight: '8px' }} />
          Criar
        </button>
        <button
          className="edit-button"
          onClick={() => setIsCreateModalOpen(true)}
          disabled={!selectedUser}
        >
          <FaEdit style={{ marginRight: '8px' }} />
          Editar
        </button>
        <button
          className="delete-button"
          onClick={() => setIsConfirmationModalOpen(true)}
          disabled={!selectedUser}
        >
          <FaTrash style={{ marginRight: '8px' }} />
          Excluir
        </button>
      </div>

      {isCreateModalOpen && (
        <div className="modal-overlay">
          <div ref={modalRef}>
            <UserCreate
              onClose={() => setIsCreateModalOpen(false)}
              onSave={handleSaveUser}
              initialUser={selectedUser || undefined}
            />
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        message="Tem certeza de que deseja excluir este organizador?"
        onConfirm={() => {
          handleDeleteUser();
          setIsConfirmationModalOpen(false);
        }}
        onCancel={() => setIsConfirmationModalOpen(false)}
      />
    </div>
  );
};

export default UserList;
