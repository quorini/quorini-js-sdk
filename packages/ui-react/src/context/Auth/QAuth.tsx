import React, { createContext, useState, useEffect } from 'react';
import { AuthContextType, AuthProviderProps, User } from './QAuth.types';
import { SESSION_KEY } from '@quorini/core';
import * as AuthService from '@quorini/core';
import { Login, Signup, VerifyEmail } from '../../components/Auth';
import { parseSchemaToFormFields } from '../../utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface QAuthProviderProps extends AuthProviderProps {
  LoginComponent?: React.ComponentType<{ onLoginSuccess: () => void }>;
  SignupComponent?: React.ComponentType<{ onSignupSuccess: () => void,  }>;
  VerifyEmailComponent?: React.ComponentType<{ onVerifySuccess: () => void }>;
  signUpFormInputType?: Record<string, string>,
  usergroup?: string,
}

const QAuthProvider: React.FC<QAuthProviderProps> = ({
  children,
  LoginComponent = Login,
  SignupComponent = Signup,
  VerifyEmailComponent = VerifyEmail,
  signUpFormInputType,
  usergroup,
}) => {
  const [user, setUser] = useState<User>({} as User);
  const [authStep, setAuthStep] = useState<'login' | 'signup' | 'verifyEmail' | 'success'>('login');
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check if there is a token in localStorage to initialize user session
    const session = JSON.parse(localStorage.getItem(SESSION_KEY)!);
    if (session) {
      setSession(session);
      setUser({
        username: session.userData?.username || session.userData?.email,
        accessToken: session?.accessToken,
        refreshToken: session?.refreshToken,
      });
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const sessionData = await AuthService.login(username, password);
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      setSession(sessionData);
      setUser({ username, accessToken: sessionData?.accessToken, refreshToken: session?.refreshToken });
    } catch (error) {
      setAuthStep('login');
      throw error;
    }
  };

  const signup = async (username: string, password: string, code: string, signupFormData: any, usergroup: string) => {
    try {
      await AuthService.signup(username, password, code, signupFormData, usergroup);
      setUser({ username });
    } catch (error) {
      setAuthStep('signup');
      throw error;
    }
  };

  const verifyEmail = async (verificationCode: string, username: string) => {
    try {
      await AuthService.verifyEmail(verificationCode, username);
      setUser({ username });
    } catch (error) {
      setAuthStep('verifyEmail');
      throw error;
    }
  };

  const refreshAuthToken = async () => {
    try {
      const updatedSession = await AuthService.refreshAuthToken(user.refreshToken);
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
      setUser({ ...user, accessToken: updatedSession.accessToken, refreshToken: updatedSession.refreshToken });
    } catch (error) {
      throw error;
    }
  }

  const logout = () => {
    setUser({} as User);
    localStorage.removeItem(SESSION_KEY);
    setAuthStep('login');
  };

  const renderAuthComponent = () => {
    if (user && user.accessToken) return children;

    const signupFormFields = signUpFormInputType ? parseSchemaToFormFields(signUpFormInputType) : undefined;

    switch (authStep) {
      case 'signup':
        return <SignupComponent formFields={signupFormFields} usergroup={usergroup} onSignupSuccess={() => setAuthStep('verifyEmail')} onLoginClick={() => setAuthStep('login')} />;
      case 'verifyEmail':
        return <VerifyEmailComponent onVerifySuccess={() => setAuthStep('login')} />;
      default:
        return <LoginComponent onLoginSuccess={() => setAuthStep('success')} onSignupClick={() => setAuthStep('signup')} selfSignup={!!signUpFormInputType} />;
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, login, signup, logout, verifyEmail }}>
      {renderAuthComponent()}
    </AuthContext.Provider>
  );
};

// Export QAuth as an object with Provider property
const QAuth = {
  Provider: QAuthProvider,
};

export { QAuth, AuthContext };
