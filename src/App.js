import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import UserList from './components/UserList/UserList';
//import CreateUser from './components/CreateUser/CreateUser'; // Importar a tela de criação de usuários
import GincanaDetails from './components/Gincana/GincanaDetails'; // Importar GincanaDetails
import SidebarLayout from './components/SidebarLayout/SidebarLayout'; // Importar o layout com o menu lateral

function App() {
  return (
    <Router>
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
          path="/gincana/details" // Rota para GincanaDetails
          element={
            <SidebarLayout>
              <GincanaDetails />
            </SidebarLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
