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
        localStorage.setItem('authToken', response.data.token);

        const userResponse = await api.get('/users/me', {
          params: { email: email },
        });

        console.log('Informações do usuário obtidas:', userResponse.data);
        login(userResponse.data.user.name);

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
        <h2>Entrar</h2>
        <form onSubmit={handleLogin}>
          <div className="login-field">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-field">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Entrar
          </button>
        </form>
        <div className="register-link">
          <a href="/registro">Cadastre-se</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
