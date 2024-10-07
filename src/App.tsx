import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import UserList from './components/UserList/UserList';
import GincanaDetails from './components/Gincana/GincanaDetails';
import SidebarLayout from './components/SidebarLayout/SidebarLayout';
//import GameCreate from './components/GameCreate/GameCreate';
import GameList from './components/GameList/GameList';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas sem o menu lateral */}
        <Route path="/" element={<Login />} />
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
    </BrowserRouter>
  );
};

export default App;