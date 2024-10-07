// UserCreate.tsx
import React, { useState, useEffect } from 'react';
import './UserCreate.css'; // Importando o CSS específico do componente

interface UserCreateProps {
  onClose: () => void; // Propriedade para fechar o modal
  onSave: (user: User) => void; // Propriedade para salvar o novo usuário
  initialUser?: User; // Propriedade opcional para receber um usuário já existente para edição
}

interface User {
  nome: string;
  email: string;
  senha: string;
}

const UserCreate: React.FC<UserCreateProps> = ({ onClose, onSave, initialUser }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    if (initialUser) {
      // Atualiza todos os campos com as informações do usuário ao abrir o modal no modo de edição
      setNome(initialUser.nome || '');
      setEmail(initialUser.email || '');
      setSenha(initialUser.senha || '');
    }
  }, [initialUser]);

  const handleSave = () => {
    const newUser: User = {
      nome,
      email,
      senha,
    };
    onSave(newUser); // Chama a função onSave com todas as informações do usuário
  };

  return (
    <div className="user-create-container">
      <div className="create-user-modal">
        <h2>{initialUser ? 'Editar Usuário' : 'Cadastro de Usuário'}</h2>
        <form>
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
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
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
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
