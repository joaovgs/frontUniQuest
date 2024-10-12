import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import UserList from './components/UserList/UserList';
import GincanaDetails from './components/Gincana/GincanaDetails';
import SidebarLayout from './components/SidebarLayout/SidebarLayout';
import Header from './components/Header/Header';
import { AuthProvider } from './context/AuthContext';
import GameList from './components/GameList/GameList';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('User');
  
  const location = useLocation(); // Hook para acessar a rota atual
  
  const handleLogin = () => {
    setIsLoggedIn(true);
    setUserName('John Doe'); // Simular um usuário logado
  };

  // Função que será passada como prop para o Header para tratar o logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
  };

  // Rota atual
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  return (
    <AuthProvider>
      {/* Condiciona a renderização do Header apenas quando não estiver nas rotas de login ou register */}
      {!isAuthRoute && <Header />}

      <Routes>
        {/* Redirecionamento da rota raiz (/) para /home */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* Rotas sem o menu lateral e sem header */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas com o menu lateral */}
        <Route
          path="/home"
          element={
            <SidebarLayout>
              <Home />
            </SidebarLayout>
          }
        />
        <Route
          path="/users"
          element={
            <SidebarLayout>
              <UserList />
            </SidebarLayout>
          }
        />
        <Route
          path="/gincana/details"
          element={
            <SidebarLayout>
              <GincanaDetails />
            </SidebarLayout>
          }
        />
        <Route
          path="/games"
          element={
            <SidebarLayout>
              <GameList />
            </SidebarLayout>
          }
        />
      </Routes>
    </AuthProvider>
  );
};

const WrappedApp: React.FC = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default WrappedApp;
