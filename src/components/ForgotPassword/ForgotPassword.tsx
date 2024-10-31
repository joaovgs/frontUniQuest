import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useSnackbar } from '../../context/SnackbarContext';
import './ForgotPassword.css';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await api.post('/forgot-password', { email });
      showSnackbar('Link de recuperação enviado para o seu e-mail!', 'success');
      navigate('/login');
    } catch (error: any) {
      showSnackbar('Erro ao enviar o e-mail. Tente novamente.', 'error');
      console.error('Erro na recuperação de senha:', error);
    }
  };

  return (
    <div className="forgot-password-modal">
      <div className="forgot-password-box">
        <h2>Recuperar Senha</h2>
        <form onSubmit={handleForgotPassword}>
          <div className="forgot-password-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="forgot-password-button">
            Enviar
          </button>
        </form>
        <div className="link">
          <a href="/login">Voltar para o Login</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
