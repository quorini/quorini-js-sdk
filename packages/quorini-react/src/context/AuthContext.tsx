import React, { createContext, useContext, useState, ReactNode } from 'react';
import * as AuthService from '../utils/authService';

interface AuthContextProps {
  user: AuthService.AuthResponse['user'] | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthService.AuthResponse['user'] | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const response = await AuthService.login(email, password);
    setUser(response.user);
    setToken(response.token);
  };

  const signup = async (email: string, password: string) => {
    const response = await AuthService.signup(email, password);
    setUser(response.user);
    setToken(response.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
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
