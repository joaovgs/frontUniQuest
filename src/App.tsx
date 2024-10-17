import React from 'react';
import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import UserList from './components/UserList/UserList';
import GincanaDetails from './components/Gincana/GincanaDetails';
import SidebarLayout from './components/SidebarLayout/SidebarLayout';
import Header from './components/Header/Header';
import { AuthProvider } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';
import GameList from './components/GameList/GameList';
import CompetitonList from './components/CompetitionList/CompetitionList';
import RankingPage from './components/RankingPage/RankingPage';
import TeamList from './components/TeamList/TeamList';

const App: React.FC = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';

  return (
    <AuthProvider>
      <SnackbarProvider>
        {!isAuthRoute && <Header />}
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
            path="/competition"
            element={
              <SidebarLayout>
                <CompetitonList />
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
          <Route
            path="/teamsignup"
            element={
              <SidebarLayout>
                <TeamList />
              </SidebarLayout>
            }
          />
          <Route
            path="/ranking"
            element={
              <SidebarLayout>
                <RankingPage />
              </SidebarLayout>
            }
          />
        </Routes>
      </SnackbarProvider>
    </AuthProvider>
  );
};

const WrappedApp: React.FC = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default WrappedApp;
