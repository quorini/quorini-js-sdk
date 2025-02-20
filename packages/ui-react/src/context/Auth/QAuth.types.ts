import React from 'react';

export interface AuthProviderProps {
  children: React.ReactNode;
  LoginComponent?: React.ComponentType<{ onLoginSuccess: () => void }>;
  SignupComponent?: React.ComponentType<{ onSignupSuccess: () => void }>;
  VerifyEmailComponent?: React.ComponentType<{ onVerifySuccess: () => void }>;
}

export interface AuthContextType {
  session: any | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string, code: string, formData: any, usergroup: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (verificationCode: string, username: string) => Promise<void>;
  sendInvitation: (email: string, usergroup: string) => Promise<void>;
  acceptInvitation: (email: string, password: string, code: string) => Promise<void>;
  refreshAuthToken: () => Promise<void>;
}

export interface User {
  username: string;
  accessToken?: any;
  refreshToken?: any;
}