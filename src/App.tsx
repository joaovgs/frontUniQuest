import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import UserList from './components/UserList/UserList';
import GincanaDetails from './components/Gincana/GincanaDetails';
import SidebarLayout from './components/SidebarLayout/SidebarLayout';
import GameCreate from './components/GameCreate/GameCreate';;
import Header from './components/Header/Header';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('User');

  const handleLogin = () => {
    setIsLoggedIn(true);
    setUserName('John Doe'); // Simular um usuário logado
  };

  // Função que será passada como prop para o Header para tratar o logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
  };
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          {/* Rotas sem o menu lateral */}
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
      </Routes>
    </BrowserRouter>
  );
};

export default App;