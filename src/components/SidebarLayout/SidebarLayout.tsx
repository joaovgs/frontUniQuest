import React, { useState, useRef, useEffect, ReactNode } from 'react'
import './SidebarLayout.css'
import { FaBars } from 'react-icons/fa'

interface SidebarLayoutProps {
  children: ReactNode
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement | null>(null)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
      setIsSidebarOpen(false)
    }
  }

  useEffect(() => {
    if (isSidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isSidebarOpen])

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
            <li><a href="/">Home</a></li>
            <li><a href="/users">Cadastro de Organizadores</a></li>
            <li><a href="/create-game">Cadastro de Provas</a></li>
            <li><a href="/outra-rota">Outra opção</a></li>
          </ul>
        </nav>
      </aside>
      <div className="content">
        {children}
      </div>
    </div>
  )
}

export default SidebarLayout
