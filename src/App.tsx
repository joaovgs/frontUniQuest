import React from 'react';
import { BrowserRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';
import UserList from './components/UserList/UserList';
import CompetitionDetails from './components/CompetitionDetails/CompetitionDetails';
import SidebarLayout from './components/SidebarLayout/SidebarLayout';
import Header from './components/Header/Header';
import { AuthProvider } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';
import GameList from './components/GameList/GameList';
import CompetitonList from './components/CompetitionList/CompetitionList';
import RankingPage from './components/Ranking/Ranking';
import TeamList from './components/TeamList/TeamList';
import TeamOverview from './components/TeamOverview/TeamOverview';
import DirectConfrontationMatches from './components/DirectConfrontationMatches/DirectConfrontantionMatches';
import AllAgainstAllMatches from './components/AllAgainstAllMatches/AllAgainstAllMatches';


const App: React.FC = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/registro';

  return (
    <AuthProvider>
      <SnackbarProvider>
        {!isAuthRoute && <Header />}
        <Routes>
          <Route path="/home" element={<Navigate to="/" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route
            path="/"
            element={
              <SidebarLayout>
                <Home />
              </SidebarLayout>
            }
          />
          <Route
            path="/usuarios"
            element={
              <SidebarLayout>
                <UserList />
              </SidebarLayout>
            }
          />
          <Route
            path="/gincana/:id/detalhes"
            element={
              <SidebarLayout>
                <CompetitionDetails />
              </SidebarLayout>
            }
          />
          <Route
            path="/gincanas"
            element={
              <SidebarLayout>
                <CompetitonList />
              </SidebarLayout>
            }
          />
          <Route
            path="/provas"
            element={
              <SidebarLayout>
                <GameList />
              </SidebarLayout>
            }
          />
          <Route
            path="gincana/:competitionId/equipes"
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
          <Route
            path="/gincana/:competitionId/confronto-direto/:gameId"
            element={
              <SidebarLayout>
                <DirectConfrontationMatches />
              </SidebarLayout>
            }
          />
          <Route
            path="/gincana/:competitionId/todos-contra-todos/:gameId"
            element={
              <SidebarLayout>
                <AllAgainstAllMatches/>
              </SidebarLayout>
            }
          />
          <Route
            path="/teamoverview"
            element={
              <SidebarLayout>
                <TeamOverview />
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
