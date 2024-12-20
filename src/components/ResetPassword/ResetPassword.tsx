import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../services/api';
import { useSnackbar } from '../../context/SnackbarContext';
import './ResetPassword.css';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Captura o token da URL

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showSnackbar('As senhas não coincidem.', 'error');
      return;
    }

    try {
      await api.post('/reset-password', { token, newPassword: password });
      showSnackbar('Senha redefinida com sucesso!', 'success');
      navigate('/login');
    } catch (error: any) {
      showSnackbar('Erro ao redefinir a senha. Tente novamente.', 'error');
      console.error('Erro na redefinição de senha:', error);
    }
  };

  return (
    <div className="reset-password-modal">
      <div className="reset-password-box">
        <img className="logo" src="/images/logo.png" alt="Logo" />
        <h3>Redefinir Senha</h3>
        <form onSubmit={handleResetPassword}>
          <div className="reset-password-field">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nova Senha"
              required
            />
          </div>
          <div className="reset-password-field">
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar Nova Senha"
              required
            />
          </div>
          <button type="submit" className="reset-password-button">
            Redefinir Senha
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
