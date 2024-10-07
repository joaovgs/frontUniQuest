// src/components/Header/Header.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importa o hook useAuth para acessar o contexto
import './Header.css';

const Header: React.FC = () => {
  const { isLoggedIn, userName, login, logout } = useAuth(); // Acessa diretamente o contexto
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    setShowDropdown(false);
    logout(); // Chama a função logout diretamente do contexto
  };

  return (
    <header className="header">
      {/* Logo à esquerda */}
      <div className="logo" onClick={() => navigate('/home')}>
        LOGO
      </div>

      {/* Botão de login/logout à direita */}
      <div className="auth-button">
        {isLoggedIn ? (
          <div>
            <div onClick={() => setShowDropdown(!showDropdown)}>{userName}</div>
            {showDropdown && (
              <div className="dropdown">
                <div className="dropdown-item" onClick={handleLogoutClick}>
                  Sair
                </div>
              </div>
            )}
          </div>
        ) : (
          <div onClick={handleLoginClick}>Entrar</div>
        )}
      </div>
    </header>
  );
};

export default Header;
