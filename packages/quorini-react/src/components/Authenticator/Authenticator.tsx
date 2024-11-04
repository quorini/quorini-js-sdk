import React, { useState } from 'react';
import { login, signup, verifyAccount } from '../../services/apiClient';
import { AuthenticatorProps } from './Authenticator.types';

const Authenticator: React.FC<AuthenticatorProps> = ({
  onLoginSuccess,
  onLoginFailure,
  onSignupSuccess,
  onSignupFailure,
  onVerificationSuccess,
  onVerificationFailure,
  loginLabel = 'Login',
  signupLabel = 'Signup',
  verifyLabel = 'Verify',
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const data = await login(username, password);
      setMessage('Login successful!');
      onLoginSuccess?.(data); // Call onLoginSuccess if provided
    } catch (error) {
      setMessage('Login failed.');
      onLoginFailure?.(error); // Call onLoginFailure if provided
    }
  };

  const handleSignup = async () => {
    try {
      const data = await signup(username, email, password);
      setMessage('Signup successful!');
      onSignupSuccess?.(data); // Call onSignupSuccess if provided
    } catch (error) {
      setMessage('Signup failed.');
      onSignupFailure?.(error); // Call onSignupFailure if provided
    }
  };

  const handleVerification = async () => {
    try {
      const data = await verifyAccount(code);
      setMessage('Verification successful!');
      onVerificationSuccess?.(data); // Call onVerificationSuccess if provided
    } catch (error) {
      setMessage('Verification failed.');
      onVerificationFailure?.(error); // Call onVerificationFailure if provided
    }
  };

  return (
    <div>
      <h2>{loginLabel}</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>{loginLabel}</button>

      <h2>{signupLabel}</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignup}>{signupLabel}</button>

      <h2>{verifyLabel}</h2>
      <input type="text" placeholder="Verification Code" onChange={(e) => setCode(e.target.value)} />
      <button onClick={handleVerification}>{verifyLabel}</button>

      {message && <p>{message}</p>}
    </div>
  );
};

export default Authenticator;