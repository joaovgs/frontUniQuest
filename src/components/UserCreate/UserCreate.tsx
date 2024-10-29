import React, { useState, useEffect } from 'react';
import { useSnackbar } from '../../context/SnackbarContext';
import './UserCreate.css';
import { User, UserPayload } from '../../models/User';

interface UserCreateProps {
  onClose: () => void;
  onSave: (user: UserPayload) => void | Promise<void>;
  initialUser?: User;
}

const UserCreate: React.FC<UserCreateProps> = ({ onClose, onSave, initialUser }) => {
  const [name, setName] = useState<string>(''); 
  const [email, setEmail] = useState<string>(''); 
  const [password, setPassword] = useState<string>(''); 
  const [isEditing, setIsEditing] = useState<boolean>(!!initialUser);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (initialUser) {
      setName(initialUser.name || '');
      setEmail(initialUser.email || '');
      setPassword('');
      setIsEditing(true); 
    } else {
      setName('');
      setEmail('');
      setPassword('');
      setIsEditing(false);
    }
  }, [initialUser]);

  const validateFields = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name) {
      showSnackbar('Nome é obrigatório.', 'error');
      return false;
    }
    if (!isEditing && !email) {
      showSnackbar('Email é obrigatório.', 'error');
      return false;
    }
    if (!isEditing && email && !emailRegex.test(email)) {
      showSnackbar('Email inválido.', 'error');
      return false;
    }
    if (!isEditing && !password) {
      showSnackbar('Senha é obrigatória.', 'error');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateFields()) return;

    const newUser = {
      name,
      email,
      password,
      role: 1 
    };
    onSave(newUser);
  };

  return (
    <div className="user-create-container">
      <div className="create-user-modal">
        <h2>{isEditing ? 'Editar Organizador' : 'Cadastro de Organizador'}</h2>
        <form>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="user-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="user-input"
            disabled={isEditing}
            title={isEditing ? 'Não é possível alterar o email.' : ''}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="user-input"
          />
        </form>

        <div className="modal-actions">
          <button className="cancel-button" onClick={onClose}>
            Cancelar
          </button>
          <button className="save-button" onClick={handleSave}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCreate;
