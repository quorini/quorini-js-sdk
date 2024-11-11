import React, { useEffect, useState } from 'react';
import { login, signup, verifyEmail, logout } from '../../services/apiClient';
import { QAuthProps } from './QAuth.types';

type AuthStep = 'login' | 'signup' | 'verify' | 'success';

const DefaultSuccessPage: React.FC<{ onLogout: () => void }> = ({ onLogout }) => (
  <div>
    <h2>Welcome!!!</h2>
    <p>
      You have successfully logged in.<br/>
      To show your own page, need to add onLoginSuccess props in QAuth.
    </p>
    <button onClick={onLogout}>Log out</button>
  </div>
);

const QAuth: React.FC<QAuthProps> = ({
  onLoginSuccess,
  onLoginFailure,
  onSignupSuccess,
  onSignupFailure,
  onVerificationSuccess,
  onVerificationFailure,
}) => {
  const [authStep, setAuthStep] = useState<AuthStep>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  useEffect(() => {
    const sessionData = localStorage.getItem("session");
    if (sessionData) {
      handleLoginSuccess(JSON.parse(sessionData));
    } else {
      setAuthStep('login');
    }
  }, [])

  const handleLoginSuccess = (sessionData: any) => {
    onLoginSuccess ? onLoginSuccess(sessionData) : setAuthStep('success');
  };

  const handleLogin = async () => {
    try {
      const sessionData = await login(username, password);
      onLoginSuccess?.(sessionData);
    } catch (error) {
      onLoginFailure?.(error);
      setAuthStep('login');
    }
  };

  const handleSignup = async () => {
    try {
      const userData = await signup(username, password);
      onSignupSuccess?.(userData);
      setAuthStep('verify')
    } catch (error) {
      onSignupFailure?.(error);
      setAuthStep('signup');
    }
  };

  const handleVerification = async () => {
    try {
      const verifiedData = await verifyEmail(verificationCode, username, password);
      onVerificationSuccess?.(verifiedData);
    } catch (error) {
      onVerificationFailure?.(error);
      setAuthStep('signup');
    }
  };

  const handleLogout = () => {
    logout();
    setAuthStep('login');
  };

  return (
    <div>
      {authStep === 'login' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <h2>Login:</h2>
          <input
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
          <button type="button" onClick={() => setAuthStep('signup')}>
            Go to Signup
          </button>
        </form>
      )}

      {authStep === 'signup' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSignup();
          }}
        >
          <h2>Signup:</h2>
          <input
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Signup</button>
        </form>
      )}

      {authStep === 'verify' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleVerification();
          }}
        >
          <h2>Email Verification:</h2>
          <input
            name="verificationCode"
            placeholder="Verification Code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button type="submit">Verify</button>
        </form>
      )}

      {authStep === 'success' && <DefaultSuccessPage onLogout={handleLogout} />}
    </div>
  );
};

export default QAuth;