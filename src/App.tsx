// App.tsx
import React from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SnackbarProvider } from './context/SnackbarContext';
import AppRoutes from './routes/AppRoutes';
import Header from './components/Header/Header';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SnackbarProvider>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </SnackbarProvider>
    </AuthProvider>
  );
};

const Main: React.FC = () => {
  const location = useLocation();
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/registro' || location.pathname === '/redefinir-senha' || location.pathname === '/recuperar-senha';

  return (
    <>
      {!isAuthRoute && <Header />}
      <AppRoutes />
    </>
  );
};

export default App;
