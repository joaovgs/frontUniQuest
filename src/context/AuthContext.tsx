import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const decodeToken = jwtDecode as unknown as (token: string) => any;

type AuthContextType = {
  isLoggedIn: boolean;
  userName: string | null;
  role: number | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [role, setRole] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken: any = decodeToken(token); 
        setIsLoggedIn(true);
        setUserName(decodedToken.name);
        setRole(decodedToken.role);
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        logout();
      }
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    const decodedToken: any = decodeToken(token); 

    setIsLoggedIn(true);
    setUserName(decodedToken.name);
    setRole(decodedToken.role);
  };

  const logout = async () => {
    await api.post('/logout'); 
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUserName(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
