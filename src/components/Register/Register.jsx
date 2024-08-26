import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const navigate = useNavigate(); // Hook para navegação

  const handleCancel = () => {
    navigate('/'); // Redireciona para a tela de login
  };

  return (
    <div className="register-modal">
      <div className="register-box">
        <h2>Cadastro de Usuário</h2>
        <form>
          <div className="register-field">
            <label htmlFor="name">Nome</label>
            <input type="text" id="name" name="name" />
          </div>
          <div className="register-field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className="register-field">
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" name="password" />
          </div>
          <div className="register-actions">
            <button type="button" className="cancel-button" onClick={handleCancel}>Cancelar</button>
            <button type="submit" className="save-button">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
