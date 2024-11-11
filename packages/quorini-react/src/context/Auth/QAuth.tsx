import React, { createContext, useState, useEffect } from 'react';
import { AuthContextType, AuthProviderProps, User } from './QAuth.types';
import * as AuthService from '../../services/authService';
import { Login, Signup, VerifyEmail } from '../../components/Auth';

const SESSION_KEY = 'session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface QAuthProviderProps extends AuthProviderProps {
  LoginComponent?: React.ComponentType<{ onLoginSuccess: () => void }>;
  SignupComponent?: React.ComponentType<{ onSignupSuccess: () => void }>;
  VerifyEmailComponent?: React.ComponentType<{ onVerifySuccess: () => void }>;
}

const QAuthProvider: React.FC<QAuthProviderProps> = ({
  children,
  LoginComponent = Login,
  SignupComponent = Signup,
  VerifyEmailComponent = VerifyEmail,
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
        isActive: session?.isActive,
        accessToken: session?.accessToken,
      });
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const sessionData = await AuthService.login(username, password);
      localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      setSession(sessionData);
      setUser({ username, isActive: sessionData?.isActive, accessToken: sessionData?.accessToken });
      console.log("QAuth-login-success", sessionData);
      // setAuthStep('success');
    } catch (error) {
      setAuthStep('login');
      console.error("QAuth Login Error:", error);
      throw error;
    }
  };

  const signup = async (username: string, password: string) => {
    try {
      const userData = await AuthService.signup(username, password);
      localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      setSession(userData);
      setUser({ username, isActive: userData?.isActive, accessToken: userData?.accessToken });
      console.log("QAuth-signup-success", userData);
      // setAuthStep('verifyEmail');
    } catch (error) {
      setAuthStep('signup');
      console.error("QAuth Signup Error:", error);
      throw error;
    }
  };

  const verifyEmail = async (verificationCode: string, username: string) => {
    try {
      const verifiedData = await AuthService.verifyEmail(verificationCode, username);
      localStorage.setItem(SESSION_KEY, JSON.stringify(verifiedData));
      setSession(verifiedData);
      setUser({ username, isActive: verifiedData?.isActive, accessToken: verifiedData?.accessToken });
      console.log("QAuth-verifyEmail-success", verifiedData);
      // setAuthStep('login');
    } catch (error) {
      setAuthStep('verifyEmail');
      console.error("Verify Email Error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser({} as User);
    localStorage.removeItem(SESSION_KEY);
    setAuthStep('login');
  };

  const renderAuthComponent = () => {
    if (user && user.isActive) return children;

    switch (authStep) {
      case 'signup':
        return <SignupComponent onSignupSuccess={() => console.log("onSignupSuccess")} />;
      case 'verifyEmail':
        return <VerifyEmailComponent onVerifySuccess={() => console.log("onVerifySuccess")} />;
      default:
        return <LoginComponent onLoginSuccess={() => console.log("onLoginSuccess")} onSignupClick={() => setAuthStep('signup')} />;
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
