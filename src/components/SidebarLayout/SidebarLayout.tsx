import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { FaBars } from 'react-icons/fa';
import { Link } from 'react-router-dom'; 
import './SidebarLayout.css';
import { useAuth } from '../../context/AuthContext';

interface SidebarLayoutProps {
  children: ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const { isLoggedIn, role } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarOpen]);

  if (!isLoggedIn || role !== 1) {
    return <div className="content">{children}</div>;
  }

  return (
    <div className="layout-container">
      <button
        className={`menu-button ${isSidebarOpen ? 'hidden' : ''}`}
        onClick={toggleSidebar}
      >
        <FaBars />
      </button>
      <aside ref={sidebarRef} className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/organizadores" onClick={toggleSidebar}>Cadastro de Organizadores</Link>
            </li>
            <li>
              <Link to="/gincanas" onClick={toggleSidebar}>Cadastro de Gincanas</Link>
            </li>
            <li>
              <Link to="/provas" onClick={toggleSidebar}>Cadastro de Provas</Link>
            </li>
            <li>
              <Link to="/inscrições-equipes" onClick={toggleSidebar}>Gerenciar Inscrições</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default SidebarLayout;
