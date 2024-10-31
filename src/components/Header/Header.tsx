import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

const Header: React.FC = () => {
  const { isLoggedIn, userName, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    logout();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate('/')}>
        <img src="/images/logo.png" alt="Logo" />
      </div>

      <div className="auth-buttons">
        {isLoggedIn ? (
          <div className="user-name-container">
            <div className="user-name">
              <span>{userName}</span>
            </div>
            <div className="logout-icon" onClick={handleLogoutClick}>
              <FaSignOutAlt />
            </div>
          </div>
        ) : (
          <div className="auth-button" onClick={handleLoginClick}>
            <FaUser /> Fazer login
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
