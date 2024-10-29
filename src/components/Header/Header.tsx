import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; 
import './Header.css';

const Header: React.FC = () => {
  const { isLoggedIn, userName, logout } = useAuth(); 
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    setShowDropdown(false);
    logout();
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="logo" onClick={() => navigate('/home')}>
        LOGO
      </div>

      <div className="auth-button">
        {isLoggedIn ? (
          <div ref={dropdownRef}>
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
