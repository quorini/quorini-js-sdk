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
  const [authStep, setAuthStep] = useState<'login' | 'signup' | 'verifyEmail' | 'success'>('login');
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const pathname = window.location.pathname;
    if (pathname.includes("set-password")) {
      localStorage.removeItem(SESSION_KEY)
      setAuthStep('signup');
    } else {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY)!);
      if (session) {
        setSession(session);
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const sessionData = await AuthService.login(username, password);
      localStorage.setItem(SESSION_KEY, JSON.stringify({...sessionData, username}));
      setSession({...sessionData, username});
    } catch (error) {
      setAuthStep('login');
      throw error;
    }
  };

  const signup = async (username: string, password: string, code: string, signupFormData: any, usergroup: string) => {
    try {
      await AuthService.signup(username, password, code, signupFormData, usergroup);
    } catch (error) {
      setAuthStep('signup');
      throw error;
    }
  };

  const verifyEmail = async (verificationCode: string, username: string) => {
    try {
      await AuthService.verifyEmail(verificationCode, username);
    } catch (error) {
      setAuthStep('verifyEmail');
      throw error;
    }
  };

  const refreshAuthToken = async () => {
    try {
      const updatedSession = await AuthService.refreshAuthToken(session.refreshToken);
      localStorage.setItem(SESSION_KEY, JSON.stringify({...updatedSession, username: session.username}));
    } catch (error) {
      throw error;
    }
  }

  const sendInvitation = async (email: string, usergroup: string) => {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY)!);
      await AuthService.sendInvitation(email, usergroup, session.accessToken);
    } catch (error) {
      throw error;
    }
  }

  const acceptInvitation = async (formData: any) => {
    const { email, newPassword, inviationCode } = formData;
    try {
      await AuthService.acceptInvitation(email, newPassword, inviationCode);
    } catch (error) {
      throw error;
    }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setAuthStep('login');
  };

  const renderAuthComponent = () => {
    if (session && session.accessToken) return children;

    const signupFormFields = signUpFormInputType ? parseSchemaToFormFields(signUpFormInputType) : undefined;

    switch (authStep) {
      case 'signup':
        return (
          <SignupComponent
            formFields={signupFormFields}
            usergroup={usergroup}
            onSignupSuccess={() => setAuthStep('verifyEmail')}
            onAcceptSuccess={() => setAuthStep('login')}
            onLoginClick={() => setAuthStep('login')}
          />
        );
      case 'verifyEmail':
        return (
          <VerifyEmailComponent onVerifySuccess={() => setAuthStep('login')} />);
      default:
        return (
          <LoginComponent
            onLoginSuccess={() => setAuthStep('success')}
            onSignupClick={() => setAuthStep('signup')}
            selfSignup={!!signUpFormInputType}
          />
        );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        login,
        signup,
        logout,
        verifyEmail,
        sendInvitation,
        acceptInvitation,
        refreshAuthToken,
      }}
    >
      {renderAuthComponent()}
    </AuthContext.Provider>
  );
};

// Export QAuth as an object with Provider property
const QAuth = {
  Provider: QAuthProvider,
};

export { QAuth, AuthContext };
