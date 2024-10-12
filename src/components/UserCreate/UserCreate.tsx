import React, { useState, useEffect } from 'react';
import './UserCreate.css';
import { User } from '../../models/User';

interface UserCreateProps {
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'created_at' | 'system_deleted' | 'system_date_deleted'>) => void | Promise<void>;
  initialUser?: User;
}

const UserCreate: React.FC<UserCreateProps> = ({ onClose, onSave, initialUser }) => {
  const [name, setName] = useState<string>(''); 
  const [email, setEmail] = useState<string>(''); 
  const [password, setPassword] = useState<string>(''); 

  useEffect(() => {
    if (initialUser) {
      setName(initialUser.name || '');
      setEmail(initialUser.email || '');
      setPassword('');
    }
  }, [initialUser]);

  const handleSave = () => {
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
        <h2>{initialUser ? 'Editar Usuário' : 'Cadastro de Usuário'}</h2>
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
