import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from '../../context/SnackbarContext';
import api from '../../services/api';
import './Register.css';
import { FaSave, FaTimes } from 'react-icons/fa';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCancel = () => {
    navigate('/login');
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newUser = { name, email, password, role: 0 };
      await api.post('/users', newUser);

      try {
        const response = await api.post('/sessions', { email, password });

        if (response.status === 200) {
          localStorage.setItem('authToken', response.data.token);
          const userResponse = await api.get('/users/me', { params: { email } });

          login(userResponse.data.user.name);

          showSnackbar('Usuário cadastrado e logado com sucesso!', 'success');

          navigate('/');
        }
      } catch (loginError) {
        showSnackbar('Erro ao fazer login após o registro. Tente manualmente.', 'error');
        console.error('Erro ao fazer login após registro:', loginError);
      }
    } catch (registerError: any) {
      if (registerError.response && registerError.response.status === 409) {
        showSnackbar('E-mail já cadastrado. Tente outro e-mail.', 'error');
      } else {
        showSnackbar('Erro ao criar usuário. Tente novamente.', 'error');
      }
      console.error('Erro ao criar usuário:', registerError);
    }
  };

  return (
    <div className="register-modal">
      <div className="register-box">
        <h2>Cadastro de Usuário</h2>
        <form onSubmit={handleSave}>
          <div className="register-field">
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome"
              required
            />
          </div>
          <div className="register-field">
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
          <div className="register-field">
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
          <div className="register-actions">
            <button type="button" className="cancel-button" onClick={handleCancel}>
              <FaTimes style={{ marginRight: '8px' }} /> Cancelar
            </button>
            <button type="submit" className="save-button">
              <FaSave style={{ marginRight: '8px' }} /> Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
