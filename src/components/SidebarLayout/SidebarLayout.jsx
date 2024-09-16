import React, { useState, useRef, useEffect } from 'react';
import './SidebarLayout.css';
import { FaBars } from 'react-icons/fa';

function SidebarLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
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
            <li><a href="/home">Home</a></li>
            <li><a href="/users">Cadastro de Organizadores</a></li>
            <li><a href="/outra-rota">Outra opção</a></li>
          </ul>
        </nav>
      </aside>
      <div className="content">
        {children}
      </div>
    </div>
  );
}

export default SidebarLayout;
