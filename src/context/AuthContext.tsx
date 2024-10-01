// src/context/AuthContext.tsx
import React, { createContext, useContext, useState } from 'react';

// Definindo os tipos para o contexto
type AuthContextType = {
  isLoggedIn: boolean;
  userName: string;
  login: (name: string) => void;
  logout: () => void;
};

// Contexto inicial sem implementação (valores padrão)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provedor de contexto para gerenciar o estado e funções de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const login = (name: string) => {
    setIsLoggedIn(true);
    setUserName(name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para facilitar o uso do contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
