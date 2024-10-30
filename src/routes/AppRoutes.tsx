import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../components/Login/Login';
import Register from '../components/Register/Register';
import Home from '../components/Home/Home';
import UserList from '../components/UserList/UserList';
import CompetitionDetails from '../components/CompetitionDetails/CompetitionDetails';
import SidebarLayout from '../components/SidebarLayout/SidebarLayout';
import GameList from '../components/GameList/GameList';
import CompetitonList from '../components/CompetitionList/CompetitionList';
import RankingPage from '../components/Ranking/Ranking';
import TeamRegistration from '../components/TeamRegistration/TeamRegistration';
import TeamList from '../components/TeamList/TeamList';
import DirectConfrontationMatches from '../components/DirectConfrontationMatches/DirectConfrontationMatches';
import AllAgainstAllMatches from '../components/AllAgainstAllMatches/AllAgainstAllMatches';
import ForgotPassword from '../components/ForgotPassword/ForgotPassword';
import PrivateRoute from './PrivateRoute';
import OrganizerRoute from './OrganizerRoute';
import ResetPassword from '../components/ResetPassword/ResetPassword';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar-senha" element={<ForgotPassword />} />
      <Route path="/redefinir-senha" element={<ResetPassword />} />

      <Route
        path="/"
        element={
          <SidebarLayout>
            <Home />
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
        path="/gincana/:competitionId/ranking"
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
            <AllAgainstAllMatches />
          </SidebarLayout>
        }
      />

      <Route element={<PrivateRoute />}>
        <Route
          path="/gincana/:competitionId/equipes"
          element={
            <SidebarLayout>
              <TeamRegistration />
            </SidebarLayout>
          }
        />
        
        <Route element={<OrganizerRoute />}>
          <Route
            path="/organizadores"
            element={
              <SidebarLayout>
                <UserList />
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
            path="/inscrições-equipes"
            element={
              <SidebarLayout>
                <TeamList />
              </SidebarLayout>
            }
          />
        </Route>        
      </Route>
    </Routes>
  );
};

export default AppRoutes;
