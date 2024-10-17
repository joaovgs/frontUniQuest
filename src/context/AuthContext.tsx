import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';

type AuthContextType = {
  isLoggedIn: boolean;
  userName: string;
  login: (name: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const login = (name: string) => {
    setIsLoggedIn(true);
    setUserName(name);
  };

  const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUserName('');    
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
