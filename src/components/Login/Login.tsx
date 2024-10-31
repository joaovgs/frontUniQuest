import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import api from '../../services/api';
import './Login.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSnackbar } = useSnackbar(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      console.log('Enviando requisição de login...');
      const response = await api.post('/sessions', { email, password });

      if (response.status === 200) {
        console.log('Login bem-sucedido, status:', response.status);
        
        const token = response.data.token;
        login(token); 

        showSnackbar('Login realizado com sucesso!', 'success');
        navigate('/');
      }
    } catch (error: any) {
      showSnackbar('Credenciais incorretas. Verifique e tente novamente.', 'error');
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div className="login-modal">
      <div className="login-box">
        <img className="logo" src="/images/logo.png" alt="Logo" />
        <form onSubmit={handleLogin}>
          <div className="login-field">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="login-field">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Entrar
          </button>          
        </form>
        <div className="link">
          <a href="/recuperar-senha">Esqueceu sua senha?</a>
        </div>
        <div className="link">
          <a href="/registro">Cadastre-se</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
