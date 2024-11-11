import React from 'react';

export interface AuthProviderProps {
  children: React.ReactNode;
  LoginComponent?: React.ComponentType<{ onLoginSuccess: () => void }>;
  SignupComponent?: React.ComponentType<{ onSignupSuccess: () => void }>;
  VerifyEmailComponent?: React.ComponentType<{ onVerifySuccess: () => void }>;
}

export interface AuthContextType {
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (verificationCode: string, username: string, password: string) => Promise<void>;
}

export interface User {
  username: string;
  isActive: boolean;
  accessToken: any;
}